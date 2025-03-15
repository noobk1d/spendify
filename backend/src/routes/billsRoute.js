const express = require("express");
const router = express.Router();
const billsController = require("../controllers/billsController");

router.post("/:userId", billsController.addBill);
router.get("/:userId", billsController.getAllBills);
router.patch("/:id/:userId", billsController.updateBill);
router.delete("/:id/:userId", billsController.deleteBill);
router.get("/upcoming/:userId", billsController.getUpcomingBills);
router.get("/summary/:userId", billsController.getTotalBillsSummary);

module.exports = router;
