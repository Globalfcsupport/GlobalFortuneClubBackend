const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Setting } = require("../models/admin.model");
const User = require("../models/users.model");
const { AdminYield, Slot, Payment } = require("../models/payment.history");

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
  ]);
  return values;
};

const getSetting = async (req) => {
  let values = await Setting.findOne().sort({ createdAt: -1 });
  return values;
};

module.exports = {
  createSetting,
  updateSetting,
  getAppReport_Dashboard,
  getUserList,
  TrnsactionHistories,
  getSetting,
};
