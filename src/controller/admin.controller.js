const AdminService = require("../services/admin.service");
const catchAsync = require("../utils/catchAsync");

const createSetting = catchAsync(async (req, res) => {
  const data = await AdminService.createSetting(req);
  res.send(data);
});

const updateSetting = catchAsync(async (req, res) => {
  const data = await AdminService.updateSetting(req);
  res.send(data);
});

const getAppReport_Dashboard = catchAsync(async (req, res) => {
  const data = await AdminService.getAppReport_Dashboard(req);
  res.send(data);
});

const getUserList = catchAsync(async (req, res) => {
  const data = await AdminService.getUserList(req);
  res.send(data);
});

const TrnsactionHistories = catchAsync(async (req, res) => {
  const data = await AdminService.TrnsactionHistories(req);
  res.send(data);
});

const getSetting = catchAsync(async (req, res) => {
  const data = await AdminService.getSetting(req);
  res.send(data);
});

module.exports = {
  createSetting,
  updateSetting,
  getAppReport_Dashboard,
  getUserList,
  TrnsactionHistories,
  getSetting,
};
