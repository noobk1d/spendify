const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/:userId", reportController.getDashboardReports);

module.exports = router;
