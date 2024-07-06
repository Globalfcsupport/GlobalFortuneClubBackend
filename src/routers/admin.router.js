const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");

router.route("/setting").post(VerifyAuthToken, AdminController.createSetting).get(VerifyAuthToken, AdminController.getSetting);
router.route("/setting/:id").put(VerifyAuthToken, AdminController.updateSetting);
router.route("/get/appreport/dashboard").get(VerifyAuthToken, AdminController.getAppReport_Dashboard);
router.route("/getuserlist").get(VerifyAuthToken, AdminController.getUserList)
router.route("/trnsaction/histories").get(VerifyAuthToken, AdminController.TrnsactionHistories)
module.exports = router;
