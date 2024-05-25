const express = require("express");
const router = express.Router();
const AuthContrller = require("../controller/auth.controller");
const { CheckSignUpPermission } = require("../middlewares/signup.middleware");

router
  .route("/register")
  .post(CheckSignUpPermission, AuthContrller.Registration);
router.route("/verify").post(AuthContrller.VerifyOTP);
router.route("/admin/login").post(AuthContrller.AdminLogin);
router.route("/verifyref").post(CheckSignUpPermission, AuthContrller.VerifyRef);
router.route("/send/otp").post(AuthContrller.GenerateOTP);
router.route("/user/login").post(AuthContrller.LoginWithOTPVerify)

module.exports = router;
