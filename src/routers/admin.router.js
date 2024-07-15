const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");

router.route("/setting").post(VerifyAuthToken, AdminController.createSetting).get(VerifyAuthToken, AdminController.getSetting);
router.route("/setting/new").post(VerifyAuthToken, AdminController.createSetting)
router.route("/setting/:id").put(VerifyAuthToken, AdminController.updateSetting);
router.route("/get/appreport/dashboard").get(VerifyAuthToken, AdminController.getAppReport_Dashboard);
router.route("/getuserlist").get(VerifyAuthToken, AdminController.getUserList)
router.route("/trnsaction/histories").get(VerifyAuthToken, AdminController.TrnsactionHistories);
router.route("/getfc/slots/log").get(VerifyAuthToken, AdminController.getFcSlotsLog);
router.route("/getwidthdraw/requests").get(VerifyAuthToken, AdminController.getWidthdrawRequests)
module.exports = router;
