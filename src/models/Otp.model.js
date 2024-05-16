const mongoose = require("mongoose");
const { v4 } = require("uuid");

const OtpSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    OTP: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model("otp", OtpSchema);

module.exports = OTP;
