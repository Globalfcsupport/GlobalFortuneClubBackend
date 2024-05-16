const express = require("express");
const router = express.Router();
const AuthContrller = require("../controller/auth.controller");

router.route("/register").post(AuthContrller.Registration);
router.route("/verify").post(AuthContrller.VerifyOTP);
router.route("/admin/login").post(AuthContrller.AdminLogin);
module.exports = router;
