const mongoose = require("mongoose");
const { v4 } = require("uuid");

const refferalIncomeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    amount: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    receiverId:{
      type:String
    },
  },
  { timestamps: true }
);

const internalTransactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    amount: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    senderId: {
      type: String,
    },
  },
  { timestamps: true }
);

const RefferalIncome = mongoose.model("refferalincome", refferalIncomeSchema);
const InternalTransaction = mongoose.model("internaltransaction", internalTransactionSchema);


module.exports = {
  RefferalIncome,
  InternalTransaction,
};
