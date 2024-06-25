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
  AdminWallet,
} = require("../models/payment.history");
const { SpliteYield } = require("../utils/yield.split");
const Chat = require("../models/chat.model");
const { Setting } = require("../models/admin.model")

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
  let findByOrderId = await Payment.findOne({ orderId: req.body.orderId, status:{$ne:"Paid"} });
  console.log(req.body.email);
  if (findByOrderId) {
    res = await Payment.findByIdAndUpdate(
      { _id: findByOrderId._id },
      req.body,
      {
        new: true,
      }
    );
    if (res.status == "Paid") {
      let updated = await User.findOneAndUpdate(
        { email: req.body.email },
        { $inc: { myWallet: res.amount } },
        { new: true }
      );
      console.log(updated, "If");
    }

    console.log(updated);
  } else {
    res = await Payment.create(req.body);
    if (res.status == "Paid") {
      let updated = await User.findOneAndUpdate(
        { email: req.body.email },
        { $inc: { myWallet: res.amount } },
        { new: true }
      );
      console.log(updated, "Else");
    }
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

// const activateClub = async (req) => {
//   let userId = req.userId;
//   let finduserById = await User.findById(userId);
//   if (!finduserById) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
//   }
//   let userWallet = await Payment.aggregate([
//     {
//       $match: {
//         email: finduserById.email,
//       },
//     },
//     {
//       $addFields: {
//         amount: { $toDouble: "$amount" },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         count: { $sum: 1 },
//         totalSum: { $sum: "$amount" },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         amount: "$totalSum",
//       },
//     },
//   ]);
//   let slots = await Slot.find().count();
//   let WalletAmount =
//     userWallet.length == 0 ? 0 : userWallet[0].amount.toFixed(4);
//   let convertedValue = Math.floor(WalletAmount / 100);
//   let slotcreations;
//   for (let index = 0; index < convertedValue; index++) {
//     if (index == 0) {
//       slotcreations = await Slot.create({
//         status: "Activated",
//         userId: userId,
//         no_ofSlot: index + 1,
//       });
//       Yield.create({
//         userId: userId,
//         slotId: slotcreations._id,
//         no_ofSlot: slotcreations.no_ofSlot,
//         status: slotcreations.status,
//       });
//       if (slots == 0) {
//         AdminYield.create({ Yield: 100 });
//       } else {
//         SpliteYield(userId);
//       }
//     } else {
//       slotcreations = await Slot.create({
//         status: "Pending",
//         userId: userId,
//         no_ofSlot: index + 1,
//       });
//       Yield.create({
//         userId: userId,
//         slotId: slotcreations._id,
//         no_ofSlot: slotcreations.no_ofSlot,
//         status: slotcreations.status,
//       });
//     }
//   }
//   return { messages: "Slot Created..." };
// };

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
  const id = req.params.id;
  const userId = req.userId;
  let users = [userId, id];
  let findExist = await Chat.findOne({ userIds: { $all: users } });
  if (findExist) {
    return findExist;
  } else {
    let values = await Chat.create({ userIds: users });
    return values;
  }
};

const getChathistory = async (req) => {
  let id = req.params.id;
  let userId = req.userId;
  let users = [userId, id];
  let findExist = await Chat.findOne({ userIds: { $all: users } });
  if (findExist) {
    return findExist.messages.reverse();
  } else {
    return [];
  }
};

const getFcSlots = async (req) => {
  let userId = req.userId;
  let status = req.query.status;
  let statusMatch = { status: "Activated" };
  if (status) {
    statusMatch = { status: status };
  }
  console.log(userId);
  let values = await Yield.aggregate([
    {
      $match: {
        $and: [{ userId: userId }, statusMatch],
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        slotId: 1,
        no_ofSlot: 1,
        totalYield: 1,
        crowdStock: 1,
        currentYield: 1,
        status: 1,
        wallet: 1,
        date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
      },
    },
  ]);
  return values;
};

const getUsersByRefId = async (req) => {
  let refId = req.refId;
  console.log(refId, "OPOP");
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const todayEnd = new Date(new Date().setHours(24, 0, 0, 0));
  let values = await User.aggregate([
    {
      $match: {
        uplineId: refId,
      },
    },
    {
      $facet: {
        todayData: [
          {
            $match: {
              createdAt: {
                $gte: todayStart,
                $lt: todayEnd,
              },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              documents: { $push: "$$ROOT" },
            },
          },
        ],
        overallData: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              documents: { $push: "$$ROOT" },
            },
          },
        ],
      },
    },
    {
      $project: {
        todayCount: { $arrayElemAt: ["$todayData.count", 0] },
        overallCount: { $arrayElemAt: ["$overallData.count", 0] },
        documents: {
          $concatArrays: [
            { $arrayElemAt: ["$todayData.documents", 0] },
            { $arrayElemAt: ["$overallData.documents", 0] },
          ],
        },
      },
    },
  ]);
  return values;
};

const getUserDetails_Dashboard = async (req) => {
  let userId = req.userId;
  let values = await User.aggregate([
    {
      $match: { _id: userId },
    },
    {
      $lookup: {
        from: "yields",
        localField: "_id",
        foreignField: "userId",
        pipeline: [
          {
            $group: {
              _id: null,
              walletTotal: { $sum: "$wallet" },
              croudTotal: { $sum: "$crowdStock" },
              yieldTotal: { $sum: "$currentYield" },
              activatedTotal: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Activated"] }, 1, 0],
                },
              },
              completedTotal: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
                },
              },
            },
          },
        ],
        as: "mywallet",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$mywallet",
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "email",
        foreignField: "email",
        pipeline: [
          {
            $match: { status: "Paid" },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ],
        as: "Payment",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$Payment",
      },
    },
    {
      $project: {
        _id: 1,
        role: 1,
        userName: 1,
        email: 1,
        active: 1,
        refId: 1,
        uplineId: 1,
        wallet: { $ifNull: ["$mywallet.walletTotal", 0] },
        crowd: { $ifNull: ["$mywallet.croudTotal", 0] },
        Yield: { $ifNull: ["$mywallet.yieldTotal", 0] },
        activatedTotal: { $ifNull: ["$mywallet.activatedTotal", 0] },
        completedTotal: { $ifNull: ["$mywallet.completedTotal", 0] },
        totalCryptoTopup: { $ifNull: ["$Payment.total", 0] },
        started: 1,
      },
    },
  ]);
  return values[0];
};

const getTopupDetails = async (req) => {
  let userId = req.userId;
  let values = await User.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "email",
        foreignField: "email",
        as: "Payment",
      },
    },
  ]);
  return values[0];
};

const activateClub = async (req) => {
  let userId = req.userId;
  let slots = await Slot.find().count();
  if (slots == 0) {
    let findUserbyId = await User.findById(userId);
    if (!findUserbyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    } else if (findUserbyId.amount < 100) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    findUserbyId = await User.findByIdAndUpdate(
      { _id: userId },
      { started: true, $inc: { myWallet: -100 } },
      { new: true }
    );
    let createSlot = await Slot.create({ userId: userId, status: "Activated" });
    let createYield = await Yield.create({
      userId: userId,
      status: "Activated",
      slotId: createSlot._id,
      totalYield: 200,
      currentYield: 0,
      crowdStock: 0,
    });
    await AdminYield.create({ Yield: 100 });
    let findSetting =  await Setting.findOne().sort({createdAt:-1});
    let refCOmmision = findSetting.ReferalCommisionSlot;
    let findReference = await User.findOne({refId:findUserbyId.uplineId});
    let PlatformFee = (100 * refCOmmision) / 100;
    findReference = await User.findOneAndUpdate({_id:findReference._id}, {$inc:{adminWallet:PlatformFee}}, {new:true});
    return createYield;
  } else {
    let findUserbyId = await User.findById(userId);
    if (!findUserbyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    } else if (findUserbyId.amount < 100) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    findUserbyId = await User.findByIdAndUpdate(
      { _id: userId },
      { started: true, $inc: { myWallet: -100 } },
      { new: true }
    );
    let createSlot = await Slot.create({ userId: userId, status: "Activated" });
    let createYield = await Yield.create({
      userId: userId,
      status: "Activated",
      slotId: createSlot._id,
      totalYield: 200,
      currentYield: 0,
      crowdStock: 0,
    });
    SpliteYield(userId);
    return createYield;
  }
};

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
  getFcSlots,
  getUsersByRefId,
  getUserDetails_Dashboard,
  getTopupDetails,
};
