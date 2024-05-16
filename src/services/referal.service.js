const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Referal = require("../models/referal");

const createReferalCode = async (req) => {
  const { referalCode } = req.body;
  let findRefById = await Referal.findById(referalCode);
  if (!findRefById) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Referal Code Already Exist");
  }
  return await Referal.create(req.body);
};

module.exports = {
  createReferalCode,
};
