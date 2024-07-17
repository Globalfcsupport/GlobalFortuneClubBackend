const AuthService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const { sendOtpVerification } = require("../services/email.service");
const { generateAdminAuthToken } = require("../middlewares/jwt");
const UserService = require("../services/user.service");

const Registration = catchAsync(async (req, res) => {
  const data = await AuthService.Registration(req);
  res.status(201).send(data._doc);
});

const VerifyOTP = catchAsync(async (req, res) => {
  const data = await AuthService.VerifyOTP(req.body);
  res.send(data);
});

const LoginWithOTP = catchAsync(async (req, res) => {
  const data = await AuthService.VerifyOTP(req.body);
  res.send({ data, token });
});

const AdminLogin = catchAsync(async (req, res) => {
  const data = await UserService.LoginWithEmailPassword(req);
  let token = await generateAdminAuthToken(data);
  res.send({ data, token });
});

const VerifyRef = catchAsync(async (req, res) => {
  const data = await AuthService.VerifyRef(req);
  res.send(data);
});

const GenerateOTP = catchAsync(async (req, res) => {
  const data = await AuthService.GenerateOTP(req);
  await sendOtpVerification(data);
  res.send({ message: "OTP SEND SUCCESSFULLY...." });
});

const LoginWithOTPVerify = catchAsync(async (req, res) => {
  const data = await AuthService.LoginWithOTPVerify(req);
  let token = await generateAdminAuthToken(data);
  res.send({ data, token });
});

const GenerateOTPSignUp = catchAsync(async (req, res) => {
  const data = await AuthService.GenerateOTPSignUp(req);
  await sendOtpVerification(data);
  res.send({ message: "OTP SEND SUCCESSFULLY...." });
});

module.exports = {
  Registration,
  VerifyOTP,
  LoginWithOTP,
  AdminLogin,
  VerifyRef,
  GenerateOTP,
  LoginWithOTPVerify,
  GenerateOTPSignUp,
};
