const mongoose = require("mongoose");
const { v4 } = require("uuid");

const ChatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    messages: {
      type: Array,
      default: [],
    },
    userIds: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("chats", ChatSchema);

module.exports = Chat;
