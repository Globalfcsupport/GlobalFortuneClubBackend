const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");
const { errorConverter, errorHandler } = require("./middlewares/error");
const routes = require("./routers");
const bodyParser = require("body-parser");
const ApiError = require("./utils/ApiError");
const { authLimiter } = require("./middlewares/rateLimiter");
const cron = require("node-cron");
const logger = require("./config/logger");
const { AutoActivateSlot } = require("./utils/autoActivate");
const socketIo = require("socket.io");
const http = require("http");
const Chat = require("./models/chat.model");
const { InternalTransaction,  } = require("./models/refIncome.model");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const path = require('path');
const User = require("./models/users.model");

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.status(200).send({ message: "GFC API WORKING........" });
});


let socketPort = process.env.SOCKET_PORT || 5001;

const socketServer = http.createServer(app);

const sessions = {};
app.use(express.static(path.join(__dirname, '../public')));

const io = socketIo(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path:"/ws"
});
const connectedUsers = {};
io.on("connection", (socket) => {
  console.log("user connected");

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("joined room", roomId);
  });

  // Handle sending a message to a room
  socket.on("messageToRoom",async (data) => {
    console.log(data, "room chat");
    await Chat.findByIdAndUpdate(
      data.roomId,
      {
        $push: {
          messages: {
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId
          }
        }
      },
      { new: true }
    );    io.to(data.roomId).emit('message', {
      id: socket.id,
      message: data.message,
      receiverId:data.receiverId,
      senderId:data.senderId
    });
  });

  socket.on("transferToToom",async (data) => {
    console.log(data, "room chat");
    // await Chat.findByIdAndUpdate({_id:data.roomId}, {$push: {messages:{msg:data.message, senderId:data.senderId, receiverId:data.receiverId}}}, {new:true})
    io.to(data.roomId).emit('Trnsaction', {
      id: socket.id,
      message: data.money
    });
  });

  // Handle sending a private message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log("senderId", senderId, "msg", message);
    io.to(receiverId).emit("newMessage", { senderId, message,receiverId  });
  });
// Assuming you have the necessary imports and server setup

socket.on("sendMoney", async (data) => {
  console.log("Money Transfer", data);
  await Chat.findByIdAndUpdate(
    data.roomId, 
    {
      $push: {
        messages: {
          message: `Transferred $${data.money} to ${data.receiverId}`,
          payment: data.payment,
          money: data.money,
          senderId: data.senderId,
          receiverId: data.receiverId
        }
      }
    },
    { new: true }
  );
  InternalTransaction.create({senderId: data.senderId, amount:data.money, userId:data.receiverId})
  await User.findByIdAndUpdate(data.senderId, {$inc: {myWallet: -data.money}}, {new: true});
  io.to(data.roomId).emit("Trnsaction", { data });
});


});

cron.schedule('* * * * *', () => {
  console.log('running a task every minute')
  AutoActivateSlot()
});

app.use("/v1", routes);
app.use("/v1/auth", authLimiter);

app.use(errorConverter);

app.use(errorHandler);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// testcron.start();
socketServer.listen(socketPort, () => {
  logger.info("Connected To Socket");
});

module.exports = app;
