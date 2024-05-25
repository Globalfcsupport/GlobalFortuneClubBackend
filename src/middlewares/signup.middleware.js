const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Setting } = require("../models/admin.model");

const CheckSignUpPermission = async (req, res, next) => {
  let findPermission = await Setting.findOne({ allowNewSignUp: true }).sort({
    createdAt: -1,
  });
  if (!findPermission) {
    throw new ApiError(httpStatus.FORBIDDEN, "Sorry SignUp Engaged");
  }
  next();
};

module.exports = {
  CheckSignUpPermission,
};
