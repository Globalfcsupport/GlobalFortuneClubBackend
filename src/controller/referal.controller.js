const ReferalService = require("../services/referal.service");
const catchAsync = require("../utils/catchAsync");

const createReferalCode = catchAsync(async (req, res) => {
  const data = await ReferalService.createReferalCode(req);
  res.send(data);
});

const verifyReferralID = catchAsync(async (req, res)=> {
  const data = await ReferalService.verifyReferralID(req);
  res.send(data);
})

module.exports = {
  createReferalCode,
  verifyReferralID
};
