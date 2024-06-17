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
const {
  Payment,
  Yield,
  Slot,
  AdminYield,
} = require("../models/payment.history");
const { SpliteYield } = require("../utils/yield.split");
const Chat = require("../models/chat.model");

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
        callbackUrl: `${backendUrl}/v1/user/payment/notification?apiKey=${apiKey}`,
        returnUrl: `http://localhost:5000/app/DashBoard`,
        orderId: orderId,
        email,
        userId,
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
  let res;
  let findByOrderId = await Payment.findOne({ orderId: req.body.orderId });
  console.log(req.body);
  if (findByOrderId) {
    res = await Payment.findByIdAndUpdate(
      { _id: findByOrderId._id },
      req.body,
      {
        new: true,
      }
    );
  } else {
    res = await Payment.create(req.body);
    return findByOrderId;
  }
};

const getPaymentHistoryByUser = async (req) => {
  let userId = req.userId;
  let finduserById = await User.findById(userId);
  const paymentsByUser = await Payment.aggregate([
    {
      $match: { email: finduserById.email },
    },
  ]);
  return paymentsByUser;
};

const activateClub = async (req) => {
  let userId = req.userId;
  let finduserById = await User.findById(userId);
  if (!finduserById) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
  }
  let userWallet = await Payment.aggregate([
    {
      $match: {
        email: finduserById.email,
      },
    },
    {
      $addFields: {
        amount: { $toDouble: "$amount" },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalSum: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        amount: "$totalSum",
      },
    },
  ]);
  let slots = await Slot.find().count();
  let WalletAmount =
    userWallet.length == 0 ? 0 : userWallet[0].amount.toFixed(4);
  let convertedValue = Math.floor(WalletAmount / 100);
  let slotcreations;
  for (let index = 0; index < convertedValue; index++) {
    if (index == 0) {
      slotcreations = await Slot.create({
        status: "Activated",
        userId: userId,
        no_ofSlot: index + 1,
      });
      Yield.create({
        userId: userId,
        slotId: slotcreations._id,
        no_ofSlot: slotcreations.no_ofSlot,
        status: slotcreations.status,
      });
      if (slots == 0) {
        AdminYield.create({ Yield: 100 });
      } else {
        SpliteYield(userId);
      }
    } else {
      slotcreations = await Slot.create({
        status: "Pending",
        userId: userId,
        no_ofSlot: index + 1,
      });
      Yield.create({
        userId: userId,
        slotId: slotcreations._id,
        no_ofSlot: slotcreations.no_ofSlot,
        status: slotcreations.status,
      });
    }
  }
  return { messages: "Slot Created..." };
};

const getUsersList = async (req) => {
  let userId = req.userId;
  let values = await User.aggregate([
    {
      $match: {
        $and: [{ _id: { $ne: userId } }, { role: { $ne: "admin" } }],
      },
    },
  ]);
  return values;
};

const getUserById = async (req) => {
  let id = req.params.id;
  let values = await User.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }
  return values;
};

const getUserbyAuth = async (req) => {
  let userId = req.userId;
  let values = await User.findById(userId);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }
  return values;
};

const createGroup = async (req) => {
  const id = req.params.id
  const userId = req.userId
  let users = [userId, id];
  let findExist = await Chat.findOne({ userIds: { $all: users } }); 
   if (findExist) {
    return findExist;
  } else {
    let values = await Chat.create({ userIds: users });
    return values;
  }
};

const getChathistory = async (req)=>{
  let id = req.params.id;
  let userId = req.userId
  let users = [userId, id];
  let findExist = await Chat.findOne({ userIds: { $all: users } }); 
  if(findExist){
    return findExist.messages.reverse()
  }else{
    return []
  }
}

module.exports = {
  createUser,
  LoginWithEmailPassword,
  payments,
  getPaymentNotification,
  getPaymentHistoryByUser,
  activateClub,
  getUsersList,
  getUserById,
  getUserbyAuth,
  createGroup,
  getChathistory,
};
