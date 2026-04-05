require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// 🔥 IMPORTANT: MAILER LOAD
require("./config/mailer");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= DEBUG =================
console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.PASS ? "Loaded" : "Not Loaded");

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));


// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ================= STUDENT MODEL =================
const studentSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  image: String,
  attendance: [
    {
      date: String,
      status: String
    }
  ]
});

const Student = mongoose.model("Student", studentSchema);


// ================= ADD STUDENT =================
app.post("/api/students", upload.single("image"), async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const student = new Student({
      name,
      mobile,
      image: req.file ? "/uploads/" + req.file.filename : null,
      attendance: []
    });

    await student.save();

    res.json({ success: true, student });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Failed to add student" });
  }
});


// ================= GET STUDENTS =================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ success:true, students });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Failed to load students" });
  }
});


// ================= DELETE STUDENT =================
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success:true, msg: "Student deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Delete failed" });
  }
});


// ================= MARK ATTENDANCE =================
app.post("/api/attendance", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success:false, msg: "Student not found" });
    }

    const exists = student.attendance.find(a => a.date === date);

    if (exists) {
      exists.status = status;
    } else {
      student.attendance.push({ date, status });
    }

    await student.save();

    res.json({ success:true, msg: "Attendance updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Attendance failed" });
  }
});


// ================= GET ATTENDANCE =================
app.get("/api/attendance/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success:false, msg: "Student not found" });
    }

    res.json({ success:true, attendance: student.attendance });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Failed to load attendance" });
  }
});


// ================= ATTENDANCE PERCENT =================
app.get("/api/attendance-percent/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success:false, msg: "Student not found" });
    }

    const total = student.attendance.length;
    const present = student.attendance.filter(a => a.status === "Present").length;

    const percent = total ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success:true,
      total,
      present,
      percent
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, msg: "Failed to calculate attendance" });
  }
});


// ================= STATIC FILE =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= TEST ROUTE =================
app.get("/", (req,res)=>{
  res.send("API RUNNING 🚀");
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});