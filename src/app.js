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
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.status(200).send({ message: "GFC API WORKING........" });
});

let socketPort = process.env.SOCKET_PORT || 5001;

const socketServer = http.createServer();

const sessions = {};

const io = socketIo(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
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
    await Chat.findByIdAndUpdate({_id:data.roomId}, {$push: {messages:{msg:data.message, senderId:data.senderId, receiverId:data.receiverId}}}, {new:true})
    io.to(data.roomId).emit('message', {
      id: socket.id,
      message: data.message
    });
  });

  // Handle sending a private message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log("senderId", senderId, "msg", message);
    io.to(receiverId).emit("newMessage", { senderId, message });
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
