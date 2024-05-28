const mongoose = require("mongoose");
const { v4 } = require("uuid");

const PaymentHistorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    status: {
      type: String,
    },
    trackId: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    feePaidByPayer: {
      type: Number,
    },
    underPaidCover: {
      type: Number,
    },
    email: {
      type: String,
    },
    orderId: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: Number,
    },
    payDate: {
      type: Number,
    },
    type: {
      type: String,
    },
    txID: {
      type: String,
    },
    price: {
      type: Number,
    },
    payAmount: {
      type: String,
    },
    payCurrency: {
      type: String,
    },
    network: {
      type: String,
    },
    rate: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    userId: String,
  },
  { timestamps: true }
);

const Payment = mongoose.model("payments", PaymentHistorySchema);

const WalletSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    reserveWallet: {
      type: Number,
    },
    crowdStack: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", WalletSchema);

module.exports = {
  Payment,
  Wallet,
};
