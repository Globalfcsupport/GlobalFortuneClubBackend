const { boolean } = require("joi");
const mongoose = require("mongoose");
const { v4 } = require("uuid");

const UsersSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
    userName: {
      type: String,
      requred: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    refId: {
      type: String,
      required: true,
    },
    myWallet: {
      type: Number,
      default: 0,
    },
    crowdStock: {
      type: Number,
      default: 0,
    },
    reserveMywallet: {
      type: Number,
      default: 0,
    },
    uplineId: {
      type: String,
      required: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    started: {
      type: Boolean,
      default: false,
    },
    adminWallet: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    USDTAddress: {
      type: String,
      default: "",
    },
    USDTNetwork: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UsersSchema);

module.exports = User;
