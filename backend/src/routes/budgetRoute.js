const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { verifyToken } = require("../utils/generateTokens");

// 🔹 Get Budget Details (Merged with Summary)
router.get("/total", verifyToken, budgetController.getBudget);

// 🔹 Add a New Budget Category
router.post("/total", verifyToken, budgetController.setTotalBudget);

router.post("/category", verifyToken, budgetController.setCategoryBudget);

// 🔹 Update an Existing Budget
router.patch("/update/total", verifyToken, budgetController.updateTotalBudget);

router.patch(
  "/update/category",
  verifyToken,
  budgetController.updateCategoryBudget
);

// 🔹 Delete a Budget Category
router.delete(
  "/delete/:id",
  verifyToken,
  budgetController.deleteCategoryBudget
);

module.exports = router;
