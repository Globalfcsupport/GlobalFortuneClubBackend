const express = require("express");
const router = express.Router();
const referalController = require("../controller/referal.controller");

router.route("/").post(referalController.createReferalCode);
module.exports = router;
