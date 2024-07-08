const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Setting } = require("../models/admin.model");
const User = require("../models/users.model");
const {
  AdminYield,
  Slot,
  Payment,
  Yield,
} = require("../models/payment.history");
const { InternalTransaction } = require("../models/refIncome.model");

const createSetting = async (req) => {
  let userId = req.userId;
  let creation = await Setting.create(...req.body, ...{ userId });
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

  let usersTotal = await User.find({ role: "admin" }).countDocuments();
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

  return {
    usersTotal,
    todayUsers,
    leftOverWallet: leftOverWallet ? leftOverWallet.Yield : 0,
    completedSlotAll,
    completedSlottoday,
    activeSlotToday,
    activeSlot,
    cryptoDeposite: cryptoDeposite.length > 0 ? cryptoDeposite[0].amount : 0,
  };
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

module.exports = {
  createSetting,
  updateSetting,
  getAppReport_Dashboard,
  getUserList,
  TrnsactionHistories,
  getSetting,
  getFcSlotsLog,
};
