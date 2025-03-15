const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// 🔹 Get Budget Details (Merged with Summary)
router.get("/total/:userId", budgetController.getBudget);

// 🔹 Add a New Budget Category
router.post("/total/:userId", budgetController.setTotalBudget);

router.post("/category/:userId", budgetController.setCategoryBudget);

// 🔹 Update an Existing Budget
router.patch("/update/total/:userId", budgetController.updateTotalBudget);

router.patch("/update/category/:userId", budgetController.updateCategoryBudget);

// 🔹 Delete a Budget Category
router.delete("/delete/:id/:userId", budgetController.deleteCategoryBudget);

module.exports = router;
