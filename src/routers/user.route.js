const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");

router.route("/").post(UserController.createUser);
router.route("/payment").post(VerifyAuthToken, UserController.payments);
module.exports = router;
