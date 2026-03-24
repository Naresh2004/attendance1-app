const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cors())


// ================= MONGODB =================

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err));


// ================= AUTH ROUTES =================

app.use("/api",require("./routes/auth"))


// ================= FILE UPLOAD =================

const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/")
},

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})


// ================= STUDENT SCHEMA =================

const studentSchema = new mongoose.Schema({

name:String,
mobile:String,
image:String,

attendance:[
{
date:String,
status:String
}
]

})

const Student = mongoose.model("Student",studentSchema)


// ================= ADD STUDENT =================

app.post("/api/students",upload.single("image"),async(req,res)=>{

try{

const {name,mobile}=req.body

const student = new Student({

name,
mobile,
image:req.file ? "/uploads/"+req.file.filename : null,
attendance:[]

})

await student.save()

res.json(student)

}catch(err){

console.log(err)
res.status(500).json({msg:"Failed to add student"})

}

})


// ================= GET STUDENTS =================

app.get("/api/students",async(req,res)=>{

try{

const students = await Student.find()

res.json(students)

}catch{

res.status(500).json({msg:"Failed to load students"})

}

})


// ================= DELETE STUDENT =================

app.delete("/api/students/:id",async(req,res)=>{

try{

await Student.findByIdAndDelete(req.params.id)

res.json({msg:"Student deleted"})

}catch{

res.status(500).json({msg:"Delete failed"})

}

})


// ================= MARK ATTENDANCE =================

app.post("/api/attendance",async(req,res)=>{

try{

const {studentId,date,status}=req.body

const student = await Student.findById(studentId)

if(!student){
return res.status(404).json({msg:"Student not found"})
}

student.attendance.push({
date,
status
})

await student.save()

res.json({msg:"Attendance marked"})

}catch{

res.status(500).json({msg:"Attendance failed"})

}

})


// ================= GET STUDENT ATTENDANCE =================

app.get("/api/attendance/:id",async(req,res)=>{

try{

const student = await Student.findById(req.params.id)

if(!student){
return res.status(404).json({msg:"Student not found"})
}

res.json(student.attendance)

}catch{

res.status(500).json({msg:"Failed to load attendance"})

}

})


// ================= ATTENDANCE PERCENTAGE =================

app.get("/api/attendance-percent/:id",async(req,res)=>{

try{

const student = await Student.findById(req.params.id)

if(!student){
return res.status(404).json({msg:"Student not found"})
}

const total = student.attendance.length

const present = student.attendance.filter(
a=>a.status==="Present"
).length

const percent = total ? ((present/total)*100).toFixed(2) : 0

res.json({
total,
present,
percent
})

}catch{

res.status(500).json({msg:"Failed to calculate attendance"})

}

})


// ================= STATIC UPLOADS =================

app.use("/uploads",express.static(path.join(__dirname,"uploads")))


// ================= SERVER =================

app.listen(5000,()=>console.log("Server running on 5000"))
