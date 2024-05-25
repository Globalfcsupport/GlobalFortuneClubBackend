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
      type: String,
    },
    amount: {
      type: String,
    },
    currency: {
      type: String,
    },
    feePaidByPayer: {
      type: String,
    },
    underPaidCover: {
      type: String,
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
      type: String,
    },
    payDate: {
      type: String,
    },
    type: {
      type: String,
    },
    txID: {
      type: String,
    },
    price: {
      type: String,
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
  },
  { timestamps: true }
);

const Payment = mongoose.model("payments", PaymentHistorySchema);

module.exports = {
  Payment,
};
