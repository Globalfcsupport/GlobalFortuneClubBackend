const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/users.model");
const { OTPGenerator } = require("../utils/OTP");
const OTP = require("../models/Otp.model");

const Registration = async (req) => {
  let findByEmail = await User.findOne({ email: req.body.email });
  if (findByEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Exist's");
  }
  const data = await User.create({ ...req.body, ...{ role: "user" } });
  return { ...data, ...{ otp: OTP.OTP } };
};

const GenerateOTP = async (req) => {
  const { email } = req.body;
  console.log(email);
  let OTP = await OTPGenerator(email);
  if (!OTP) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "OTP SEND FAILED........."
    );
  }
  return OTP
};

const VerifyOTP = async (body) => {
  const { email, otp } = body;
  let findOtpByemail_Otp = await OTP.findOne({
    email,
    OTP: otp,
    verified: false,
  });
  if (!findOtpByemail_Otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  findOtpByemail_Otp.verified = true;
  findOtpByemail_Otp.save();
  return { message: "OTP Verified..." };
};

const LoginWithOTP = async (body) => {
  let verify = await VerifyOTP(body);
  if (!verify) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid E-mail OR OTP");
  }
  let findByEmail = await User.findOne({ email: body.email });
  return findByEmail;
};

const VerifyRef = async (req) => {
  const { refId } = req.body;
  let findByVerificationCode = await User.findOne({ refId });
  if (!findByVerificationCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Refferal");
  }
  return findByVerificationCode;
};

module.exports = {
  Registration,
  VerifyOTP,
  LoginWithOTP,
  VerifyRef,
  GenerateOTP,
};
