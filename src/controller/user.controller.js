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

const getPaymentHistoryByUser = catchAsync(async (req, res) => {
  const data = await UserService.getPaymentHistoryByUser(req);
  res.send(data);
});

const activateClub = catchAsync(async (req, res) => {
  const data = await UserService.activateClub(req);
  res.send(data);
});

const getUsersList = catchAsync(async (req, res) => {
  const data = await UserService.getUsersList(req);
  res.send(data);
});

const getUserById = catchAsync(async (req, res)=>{
  const data = await UserService.getUserById(req);
  res.send(data)
})

const getUserbyAuth = catchAsync(async (req,res)=>{
  const data = await UserService.getUserbyAuth(req);
  res.send(data)
})

const createGroup = catchAsync (async (req,res)=>{
  const data = await UserService.createGroup(req);
  res.send(data)
})

const getChathistory = catchAsync (async (req,res)=>{
  const data = await UserService.getChathistory(req);
  res.send(data)
})

module.exports = {
  createUser,
  payments,
  getPaymentNotification,
  getPaymentHistoryByUser,
  activateClub,
  getUsersList,
  getUserById,
  getUserbyAuth,
  createGroup,
  getChathistory
};
