const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");
const { apiKeyAuthorization } = require("../middlewares/apikey.auth.js");
router.route("/").post(UserController.createUser);
router.route("/payment").post(VerifyAuthToken, UserController.payments);
router
  .route("/payment/notification")
  .post(apiKeyAuthorization, UserController.getPaymentNotification);
router
  .route("/getpayment/history/byuser")
  .get(VerifyAuthToken, UserController.getPaymentHistoryByUser);
module.exports = router;
