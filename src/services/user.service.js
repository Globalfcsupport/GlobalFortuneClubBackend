const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/users.model");
const { OTPGenerator } = require("../utils/OTP");
const { generateRefId } = require("../utils/referalIdGenerator");
const Bcrypt = require("bcryptjs");

const createUser = async (req) => {
  let findByEmail = await User.findOne({ email: req.body.email });
  if (findByEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Exist's");
  }
  let findUserCount = await User.find().count();
  let letter = "z";
  if (findUserCount == 0) {
    letter = letter;
  } else if (findUserCount == 9999) {
    letter = "A";
  }
  let pwd = req.body.password;
  let hash = await Bcrypt.hash(pwd, 8);
  let refId = await generateRefId(letter.toUpperCase(), findUserCount);
  const data = await User.create({
    ...req.body,
    ...{ refId: refId.ID + (findUserCount + 1), role: "admin", password: hash },
  });
  return data;
};

const LoginWithEmailPassword = async (req) => {
  const { password, email } = req.body;
  let findByemail = await User.findOne({ email });
  if (!findByemail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Not Registered");
  }
  let pwdCompare = await Bcrypt.compare(password, findByemail.password);
  if (!pwdCompare) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password Incorrect");
  }
  return findByemail;
};

module.exports = {
  createUser,
  LoginWithEmailPassword,
};
