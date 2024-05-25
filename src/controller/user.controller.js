const UserService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
  const data = await UserService.createUser(req);
  res.status(201).send(data);
});

const payments = catchAsync(async (req, res) => {
  const data = await UserService.payments(req);
  res.send(data);
});

const getPaymentNotification = catchAsync(async (req, res) => {
  const data = await UserService.getPaymentNotification(req);
  res.send(data);
});

module.exports = {
  createUser,
  payments,
  getPaymentNotification,
};
