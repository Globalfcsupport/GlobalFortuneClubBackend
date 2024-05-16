const mongoose = require("mongoose");
const { v4 } = require("uuid");

const SettingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    platFormFee: {
      type: Number,
      default: 0,
    },
    withdrawFee: {
      type: Number,
      default: 0,
    },
    userId: String,
    internalTransactionFee: {
      type: Number,
      default: 0,
    },
    minimumCryptoDeposite: {
      type: Number,
      default: 0,
    },
    minimuminternalTransaction: {
      type: Number,
      default: 0,
    },
    Sapcer: {
      type: Number,
      default: 0,
    },
    withdrawInterval: {
      type: Number,
      default: 0,
    },
    minimumWithdraw: {
      type: Number,
      default: 0,
    },
    allowNewSignUp: {
      type: Boolean,
      default: true,
    },
    allowNewFcSlot: {
      type: Boolean,
      default: true,
    },
    allowMaintainenceMode: {
      type: Boolean,
      default: false,
    },
    ReferalCommisionSlot: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("settings", SettingSchema);
module.exports = {
  Setting,
};
