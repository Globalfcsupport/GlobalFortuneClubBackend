const mongoose = require("mongoose");
const { v4 } = require("uuid");

const ReferalCodeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    referalCode: {
      type: String,
      required: true,
      unique: true,
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

const Referal = mongoose.model("referal", ReferalCodeSchema);

module.exports = Referal;
