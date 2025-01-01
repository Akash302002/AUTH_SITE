const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: "",
  },
  otpExpiresAt: {
    type: Date,
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpiresAt: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
