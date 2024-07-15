const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");
const { apiKeyAuthorization } = require("../middlewares/apikey.auth.js");
const User = require("../models/users.model.js");
const upload = require("../middlewares/profileUpload.js");

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
router.route("/get/fc/slots").get(VerifyAuthToken, UserController.getFcSlots)
router.route("/get/users/byrefid").get(VerifyAuthToken, UserController.getUsersByRefId);
router.route("/get/user/details/dashboard").get(VerifyAuthToken, UserController.getUserDetails_Dashboard);
router.route("/get/topup/details").get(VerifyAuthToken, UserController.getTopupDetails);
router.route("/profile/image/upload").post(upload.single('image'), VerifyAuthToken,UserController.uploadProfileImage);
router.route("/update/userprofile").post(VerifyAuthToken,UserController.updateUserProfile );
router.route("/users/admin").get(VerifyAuthToken, UserController.getUserListForDamin);
router.route("/withdraw/request").post(VerifyAuthToken, UserController.withDdrawRequest);
router.route("/get/admin/details").get(VerifyAuthToken, UserController.getAdminDetails);
router.route("/get/withdraw/details").get(VerifyAuthToken, UserController.getuserWallet);
module.exports = router;
