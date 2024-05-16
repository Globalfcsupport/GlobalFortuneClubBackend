const UserService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
  const data = await UserService.createUser(req);
  res.status(201).send(data);
});

module.exports = {
  createUser,
};
