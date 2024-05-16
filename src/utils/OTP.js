const OTP = require("../models/Otp.model");

const OTPGenerator = async (data) => {
  const { email, _id } = data;
  let otp = Math.floor(1000 + Math.random() * 9000);
  return await OTP.create({ OTP: otp, userId: _id, email: email });
};

module.exports = {
  OTPGenerator,
};
