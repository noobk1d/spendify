const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router.post("/:userId", recurringController.addRecurringTransaction);
router.get("/:userId", recurringController.getRecurringTransactions);
router.patch(
  "/:userId/pause/:id",
  recurringController.pauseRecurringTransaction
);
router.patch(
  "/:userId/resume/:id",
  recurringController.resumeRecurringTransaction
);
router.delete(
  "/:userId/delete/:id",
  recurringController.deleteRecurringTransaction
);

module.exports = router;
