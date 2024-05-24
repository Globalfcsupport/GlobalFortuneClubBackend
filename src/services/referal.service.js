const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Referal = require("../models/referal");
const { findOne } = require("../models/users.model");
const Users = require("../models/users.model")

const createReferalCode = async (req) => {
  const { referalCode } = req.body;
  let findRefById = await Referal.findById(referalCode);
  if (!findRefById) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Referal Code Already Exist");
  }
  return await Referal.create(req.body);
};

const verifyReferralID = async (req)=> {
  const { referralID } = req.body;
  let verifyRefID = await Users.findOne({refId: referralID});
  if(!verifyRefID){
    throw new ApiError(httpStatus.BAD_REQUEST, "Referal Code Already Exist");
  }
  else{
    return referralID;
  }
}
module.exports = {
  createReferalCode,
  verifyReferralID
};
