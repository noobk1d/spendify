const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../utils/generateTokens");
const router = express.Router();

// 🔹 Dashboard API
router.get("/", verifyToken, dashboardController.getDashboardData);

module.exports = router;
