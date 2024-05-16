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
    archive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UsersSchema);

module.exports = User;
