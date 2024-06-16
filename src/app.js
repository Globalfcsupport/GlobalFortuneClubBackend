const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");
const { errorConverter, errorHandler } = require("./middlewares/error");
const routes = require("./routers");
const bodyParser = require("body-parser");
const ApiError = require("./utils/ApiError");
const { authLimiter } = require("./middlewares/rateLimiter");
const cron = require('node-cron');
const logger = require("./config/logger");
const { AutoActivateSlot } = require("./utils/autoActivate");

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


// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute')
//   AutoActivateSlot()
// });

app.use("/v1", routes);
app.use("/v1/auth", authLimiter);

app.use(errorConverter);

app.use(errorHandler);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// testcron.start();

module.exports = app;
