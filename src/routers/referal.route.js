const express = require("express");
const router = express.Router();
const referalController = require("../controller/referal.controller");

router.route("/").post(referalController.createReferalCode);
router.route("/verifyRefID").post(referalController.verifyReferralID);

module.exports = router;
