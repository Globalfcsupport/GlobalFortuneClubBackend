const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
  PaymentDetail,
} = require("../models/payment.history");
const User = require("../models/users.model");
const { RefferalIncome } = require("../models/refIncome.model");
const { NumberToLetters } = require("./referalIdGenerator");
const { Setting } = require("../models/admin.model");

const CronJobs = async () => {
  let setting = await Setting.findOne().sort({ createdAt: -1 });
  let admin = await User.findOne({ role: "admin" });
  let values = await User.aggregate([
    {
      $match: {
        started: true,
        role: { $ne: "admin" },
      },
    },
    {
      $lookup: {
        from: "yields",
        localField: "_id",
        foreignField: "userId",
        pipeline: [
          {
            $match: {
              status: "Activated",
            },
          },
        ],
        as: "yields",
      },
    },
    {
      $addFields: { YieldCount: { $size: "$yields" } },
    },
    {
      $match: {
        YieldCount: { $gte: 1 },
      },
    },
    {
      $unwind: "$yields",
    },
  ]);
  return values;
};

module.exports = {
  CronJobs,
};
