const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

// 🔹 Dashboard API
router.get("/:userId", dashboardController.getDashboardData);

module.exports = router;
