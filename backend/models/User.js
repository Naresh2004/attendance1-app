const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,          // 🔥 duplicate email block
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  otp: {
    type: String,
    default: null
  },

  otpExpire: {
    type: Date,
    default: null
  },

  isOtpVerified: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);