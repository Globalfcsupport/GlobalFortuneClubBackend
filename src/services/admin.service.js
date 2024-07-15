const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Setting, withDraw } = require("../models/admin.model");
const User = require("../models/users.model");
const {
  AdminYield,
  Slot,
  Payment,
  Yield,
  AdminWallet,
} = require("../models/payment.history");
const { InternalTransaction } = require("../models/refIncome.model");

const createSetting = async (req) => {
  let userId = req.userId;
  console.log(userId);
  let creation = await Setting.create({...req.body, ...{ userId }});
  return creation;
};

const updateSetting = async (req) => {
  let settingId = req.params.id;
  let findSettingById = await Setting.findById(settingId);
  if (!findSettingById) {
    throw new ApiError(httpStatus.NOT_FOUND, "Setting Not Found");
  }
  findSettingById = await Setting.findByIdAndUpdate(
    { _id: settingId },
    req.body,
    { new: true }
  );
  return findSettingById;
};

const getAppReport_Dashboard = async (req) => {
  let userRole = req.role;
  // today flow
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  let usersTotal = await User.find({ role: { $ne: "admin" } }).countDocuments();
  let todayUsers = await User.find({
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
  }).countDocuments();

  let leftOverWallet = await AdminYield.findOne().sort({ createdAt: -1 });
  let completedSlotAll = await Slot.find({
    status: "Completed",
  }).countDocuments();

  let completedSlottoday = await Slot.find({
    status: "Completed",
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
  }).countDocuments();

  let activeSlot = await Slot.find({
    status: "Activated",
  }).countDocuments();

  let activeSlotToday = await Slot.find({
    status: "Activated",
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
  }).countDocuments();
  let cryptoDeposite = await Payment.aggregate([
    {
      $match: {
        status: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      },
    },
  ]);
  let cryptoDepositeToday = await Payment.aggregate([
    {
      $match: {
        status: "Paid",
      },
    },
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
        amount: { $sum: "$amount" },
      },
    },
  ]);

  let internalTransAll = await InternalTransaction.aggregate([
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      },
    },
  ]);

  let internalTransAllToday = await InternalTransaction.aggregate([
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
        amount: { $sum: "$amount" },
      },
    },
  ]);

  let adminCommisionAll = await AdminWallet.aggregate([
    {
      $group: {
        _id: null,
        amount: { $sum: "$adminWallet" },
      },
    },
  ]);
  let adminCommisionTodayAll = await AdminWallet.aggregate([
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
        amount: { $sum: "$adminWallet" },
      },
    },
  ]);

  let getTotalYeild = await Yield.aggregate([
    {
      $group: {
        _id: null,
        amount: { $sum: "$currentYield" },
      },
    },
  ]);
  let getTotalYeildToday = await Yield.aggregate([
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
        amount: { $sum: "$currentYield" },
      },
    },
  ]);

  let finalData = [
    { title: "Total Users", today: todayUsers, overall: usersTotal },
    {
      title: "Yield",
      today:
        getTotalYeildToday.length > 0
          ? getTotalYeildToday[0].amount.toFixed(4)
          : 0,
      overall:
        getTotalYeild.length > 0 ? getTotalYeild[0].amount.toFixed(4) : 0,
    },
    {
      title: "User Main Wallet Balance",
      today: "--",
      overall: "--",
    },
    {
      title: "User Crowd Stack Balance",
      today: "--",
      overall: "--",
    },
    { title: "Admin Wallet Balance", today: "--", overall: "--" },
    {
      title: "Admin Comission",
      today:
        adminCommisionTodayAll.length > 0
          ? adminCommisionTodayAll[0].amount
          : 0,
      overall: adminCommisionAll.length > 0 ? adminCommisionAll[0].amount : 0,
    },
    { title: "Active Slots", today: activeSlotToday, overall: activeSlot },
    {
      title: "Completed Slots",
      today: completedSlottoday,
      overall: completedSlotAll,
    },
    {
      title: "Crypto Deposit",
      today: cryptoDepositeToday.length > 0 ? cryptoDepositeToday[0].amount : 0,
      overall: cryptoDeposite.length > 0 ? cryptoDeposite[0].amount : 0,
    },
    { title: "Crypto Withdraw", today: "--", overall: "--" },
    {
      title: "Internal Transaction",
      today:
        internalTransAllToday.length > 0 ? internalTransAllToday[0].amount : 0,
      overall: internalTransAll.length > 0 ? internalTransAll[0].amount : 0,
    },
    { title: "Leftover Wallet", today: "--", overall: "--" },
  ];

  return finalData;
};

const getUserList = async (req) => {
  let userRole = req.role;
  let values = await User.aggregate([
    {
      $match: {
        role: { $ne: "admin" },
      },
    },
  ]);
  return values;
};

const TrnsactionHistories = async (req) => {
  let userRole = req.role;
  let values = await Payment.aggregate([
    {
      $match: {
        _id: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "email",
        foreignField: "email",
        as: "User",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$User",
      },
    },
    {
      $addFields: {
        timestampMillis: {
          $multiply: ["$date", 1000],
        },
      },
    },
    {
      $addFields: {
        formattedDate: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: {
              $toDate: "$timestampMillis",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        amount: 1,
        currency: 1,
        email: 1,
        date: "$formattedDate",
        userName: "$User.userName",
        userId: "$User.refId",
      },
    },
  ]);

  const internalTransaction = await InternalTransaction.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "User",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$User",
      },
    },
    {
      $addFields: {
        formattedDate: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: "$createdAt",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        status: "Paid",
        // User: "$User",
        email: "$User.email",
        userName: "$User.userName",
        userId: "$User.refId",
        currency: "USD",
        date: "$formattedDate",
      },
    },
  ]);

  return {
    Crypto: values,
    internalTransaction: internalTransaction,
    All: values.concat(internalTransaction),
  };
};

const getSetting = async (req) => {
  let values = await Setting.findOne().sort({ createdAt: -1 });
  return values;
};

const getFcSlotsLog = async () => {
  let values = await Yield.find();
  const categorized = values.reduce((acc, obj) => {
    const { status } = obj;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(obj);

    return acc;
  }, {});
  return categorized;
};

const getWidthdrawRequests = async () => {
  let values = await withDraw.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "User",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$User",
      },
    },
    {
      $project: {
        _id: 1,
        requestAmt: 1,
        receivableAmt: 1,
        active: 1,
        userId: 1,
        status: 1,
        userName: "$User.userName",
        email: "$User.email",
        refId: "$User.refId",
        USDTAddress: "$User.USDTAddress",
        USDTNetwork: "$User.USDTNetwork",
      },
    },
  ]);
  return values;
};

module.exports = {
  createSetting,
  updateSetting,
  getAppReport_Dashboard,
  getUserList,
  TrnsactionHistories,
  getSetting,
  getFcSlotsLog,
  getWidthdrawRequests,
};
