const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Setting } = require("../models/admin.model");

const createSetting = async (req) => {
  let userId = req.userId;
  let creation = await Setting.create(...req.body, ...{ userId });
  return creation;
};

const updateSetting = async (req) => {
  let settingId = req.params.id;
  let findSettingById = await Setting.findById(settingId);
  if (!findSettingById) {
    throw new ApiError(httpStatus.NOT_FOUND, "Setting Not Found");
  }
  findSettingById = await Setting.findByIdAndUpdate(
    { _id: settingId },
    req.body,
    { new: true }
  );
  return findSettingById;
};

module.exports = {
  createSetting,
  updateSetting,
};
