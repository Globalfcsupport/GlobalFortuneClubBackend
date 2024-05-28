const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/users.model");
const { OTPGenerator } = require("../utils/OTP");
const OTP = require("../models/Otp.model");
const { generateRefId } = require("../utils/referalIdGenerator");

const Registration = async (req) => {
  let findByEmail = await User.findOne({ email: req.body.email });
  if (findByEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Exist's");
  }
  await VerifyOTP(req.body);
  let findUserCount = await User.find().count();
  let letter = "z";
  if (findUserCount == 0) {
    letter = letter;
  } else if (findUserCount == 9999) {
    letter = "A";
  }
  let refId = await generateRefId(letter.toUpperCase(), findUserCount);

  const data = await User.create({ ...req.body, ...{refId: refId.ID + (findUserCount + 1), role: "user" } });
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
  return OTP;
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

const LoginWithOTPVerify = async (req) => {
  const { email, otp } = req.body;
  let findOtpByemail_Otp = await OTP.findOne({
    email,
    OTP: otp,
    verified: false,
  });

  let findByEmail = await User.findOne({ email: findOtpByemail_Otp.email });

  if (!findOtpByemail_Otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  findOtpByemail_Otp.verified = true;
  findOtpByemail_Otp.save();
  return findByEmail;
};

module.exports = {
  Registration,
  VerifyOTP,
  LoginWithOTP,
  VerifyRef,
  GenerateOTP,
  LoginWithOTPVerify,
};
