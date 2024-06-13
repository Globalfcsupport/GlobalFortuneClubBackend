const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;
let io;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");

  // Create an HTTP server
  server = http.createServer(app);

  // Initialize socket.io with the HTTP server
  io = socketIo(server, {
    cors: {
      origin: "*", // Adjust this to your client domain or specific allowed domains
      methods: ["GET", "POST"],
    },
  });

  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // Setup socket.io event handling
  io.on("connection", (socket) => {
    logger.info("New client connected");

    // Handle socket events here
    socket.on("disconnect", () => {
      logger.info("Client disconnected");
    });

    // Add more socket event handlers here as needed
    socket.on("message", (data) => {
      logger.info(`Message received: ${data}`);
      // Broadcast the message to all connected clients
      io.emit("message", data);
    });
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
