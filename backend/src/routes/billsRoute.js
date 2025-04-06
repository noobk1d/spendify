const express = require("express");
const router = express.Router();
const billsController = require("../controllers/billsController");
const { verifyToken } = require("../utils/generateTokens");

router
  .route("/")
  .get(verifyToken, billsController.getAllBills)
  .post(verifyToken, billsController.addBill);
router
  .route("/:id")
  .patch(verifyToken, billsController.updateBill)
  .delete(verifyToken, billsController.deleteBill);
router.get("/upcoming", verifyToken, billsController.getUpcomingBills);
router.get("/summary", verifyToken, billsController.getTotalBillsSummary);

module.exports = router;
