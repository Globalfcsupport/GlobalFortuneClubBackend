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

const slotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    no_ofSlot: {
      type: Number,
    },
    status: {
      type: String,
    },
    slotId: {
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
    refId: {
      type: String,
    },
  },
  { timestamps: true }
);

const yieldSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    slotId: {
      type: String,
    },
    no_ofSlot: {
      type: Number,
    },
    totalYield: {
      type: Number,
      default: 200,
    },
    currentYield: {
      type: Number,
      default: 0,
    },
    crowdStock: {
      type: Number,
      default: 0,
    },
    status: {
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
    wallet: {
      type: Number,
      default: 0,
    },
    refId: {
      type: String,
    },
  },
  { timestamps: true }
);

const adminYieldSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    Yield: {
      type: Number,
      default: 0,
    },
    status: {
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

const Slot = mongoose.model("slots", slotSchema);
const Yield = mongoose.model("yields", yieldSchema);
const AdminYield = mongoose.model("leftoveryields", adminYieldSchema);

const yieldHistorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    slotId: {
      type: String,
    },
    no_ofSlot: {
      type: Number,
    },
    totalYield: {
      type: Number,
      default: 200,
    },
    currentYield: {
      type: Number,
      default: 0,
    },
    status: {
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

const Yeild_history = mongoose.model("yeildhistories", yieldHistorySchema);

const AdminWalletSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    adminWallet: {
      type: Number,
      default: 0,
    },
    slotId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    Type: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdminWallet = mongoose.model("adminwallet", AdminWalletSchema);

const PaymentDetailsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    amountStatus: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const PaymentDetail = mongoose.model("Paymentdetails", PaymentDetailsSchema);

module.exports = {
  Payment,
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
  PaymentDetail,
};
