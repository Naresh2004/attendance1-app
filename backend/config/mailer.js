const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ng23456789000@gmail.com",
    pass: "hdnhaloddjfuqssv"
  }
});

const sendOTP = async (email, otp) => {

  await transporter.sendMail({
    from: "Auth System <ng23456789000@gmail.com>",
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP is ${otp}</h2>`
  });

};

module.exports = sendOTP;