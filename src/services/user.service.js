const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/users.model");
const { OTPGenerator } = require("../utils/OTP");
const { generateRefId } = require("../utils/referalIdGenerator");
const Bcrypt = require("bcryptjs");
const { oxaPay } = require("../config/config");
const QS = require("qs");
const Axios = require("axios");
const { v4 } = require("uuid");
const { stringify } = require("flatted");

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

const payments = async (req) => {
  let userId = req.userId;
  let finduserById = await User.findById(userId);
  if (!finduserById) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }
  const email = finduserById.email;
  const { amount } = req.body;
  const {
    apiKey,
    backendUrl,
    frontendUrl,
    oxapayLifetime,
    oxapayBaseUrl,
    oxapayMerchantKey,
    maxRequestHour,
    maxRequestLimit,
  } = oxaPay;

  // const PaymentOrder = await Axios.post(
  //   `${oxapayBaseUrl}/merchants/request`,
  //   QS.stringify({
  //     merchant: oxapayMerchantKey,
  //     amount,
  //     currency: "USD",
  //     lifeTime: oxapayLifetime,
  //     callbackUrl: `${backendUrl}/api/v01/payment/notification?apiKey=${apiKey}`,
  //     returnUrl: `${frontendUrl}/dashboard`,
  //     orderId: v4,
  //     email,
  //   }),
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   }
  // );
  // console.log(PaymentOrder.data);
  // return PaymentOrder;
  function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
  try {
    let orderId = v4();
    const PaymentOrder = await Axios.post(
      `${oxapayBaseUrl}/merchants/request`,
      QS.stringify({
        merchant: oxapayMerchantKey,
        amount,
        currency: "USD",
        lifeTime: oxapayLifetime,
        callbackUrl: `http://localhost:3333/v1/user/payment/notification?apiKey=${apiKey}`,
        returnUrl: `${frontendUrl}/dashboard`,
        orderId: orderId,
        email,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return PaymentOrder.data;

    // console.log("Response Data:", JSON.stringify(PaymentOrder.data, null, 2));
  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error(
      "Error response:",
      JSON.stringify(error.response, getCircularReplacer(), 2)
    );
  }
};

const getPaymentNotification = async (req) => {
  console.log(req.body);
  return req.body;
};

module.exports = {
  createUser,
  LoginWithEmailPassword,
  payments,
  getPaymentNotification,
};
