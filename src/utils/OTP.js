const OTP = require("../models/Otp.model");

const OTPGenerator = async (data) => {
  let otp = Math.floor(1000 + Math.random() * 9000);
  return await OTP.create({ OTP: otp, email: data });
};

module.exports = {
  OTPGenerator,
};
