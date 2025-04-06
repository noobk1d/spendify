const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");
const { verifyToken } = require("../utils/generateTokens");

router
  .route("/")
  .post(verifyToken, recurringController.addRecurringTransaction)
  .get(verifyToken, recurringController.getRecurringTransactions);
router.patch(
  "/pause/:id",
  verifyToken,
  recurringController.pauseRecurringTransaction
);
router.patch(
  "/resume/:id",
  verifyToken,
  recurringController.resumeRecurringTransaction
);
router.delete(
  "/delete/:id",
  verifyToken,
  recurringController.deleteRecurringTransaction
);

module.exports = router;
