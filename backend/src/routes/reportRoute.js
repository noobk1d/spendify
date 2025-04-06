const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { verifyToken } = require("../utils/generateTokens");

router.get("/", verifyToken, reportController.getAnalyticsData);

module.exports = router;
