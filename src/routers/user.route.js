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
router
  .route("/activate/club")
  .get(VerifyAuthToken, UserController.activateClub);
router.route("/get/users/chats").get(VerifyAuthToken, UserController.getUsersList);
router.route("/:id").get(VerifyAuthToken, UserController.getUserById)
router.route("/auth/details").get(VerifyAuthToken, UserController.getUserbyAuth);
router.route("/create/room/:id").get(VerifyAuthToken,UserController.createGroup);
router.route("/get/chat/history/:id").get(VerifyAuthToken, UserController.getChathistory);
module.exports = router;
