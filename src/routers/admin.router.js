const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin.controller");
const { VerifyAuthToken } = require("../middlewares/jwt");

router.route("/setting").post(VerifyAuthToken, AdminController.createSetting);
router.route("/setting/:id").put(VerifyAuthToken, AdminController.updateSetting);
module.exports = router;
