const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const budgetService = require("../services/budgetService");

// ✅ Get both total budget and category budgets
exports.getBudget = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extract userId from auth

  const budgets = await budgetService.getBudget(userId);

  res.status(200).json({
    status: "success",
    data: budgets,
  });
});

// ✅ Set or update total budget
exports.setTotalBudget = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { totalBudget } = req.body;

  if (totalBudget === undefined) {
    return next(new AppError("Total budget is required!", 400));
  }

  const budget = await budgetService.setTotalBudget(userId, totalBudget);

  res.status(200).json({
    status: "success",
    data: budget,
  });
});

// ✅ Set category budget (adds new or updates existing)
exports.setCategoryBudget = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { category, limit } = req.body;

  if (!category || limit === undefined) {
    return next(new AppError("Category and limit are required!", 400));
  }

  const budget = await budgetService.setCategoryBudget(userId, category, limit);

  res.status(201).json({
    status: "success",
    data: budget,
  });
});

// ✅ Update total budget separately
exports.updateTotalBudget = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { totalBudget } = req.body;

  if (totalBudget === undefined) {
    return next(new AppError("New total budget is required!", 400));
  }

  const updatedBudget = await budgetService.updateTotalBudget(
    userId,
    totalBudget
  );

  res.status(200).json({
    status: "success",
    data: updatedBudget,
  });
});

// ✅ Update category budget separately
exports.updateCategoryBudget = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { category, limit } = req.body;

  if (!category || limit === undefined) {
    return next(new AppError("Category and new limit are required!", 400));
  }

  const updatedBudget = await budgetService.updateCategoryBudget(
    userId,
    category,
    limit
  );

  res.status(200).json({
    status: "success",
    data: updatedBudget,
  });
});

// ✅ Delete a category budget
exports.deleteCategoryBudget = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  if (!id) {
    return next(new AppError("Budget ID is required!", 400));
  }

  const result = await budgetService.deleteCategoryBudget(userId, id);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});

exports.updateSpent = catchAsync(async (req, res, next) => {
  const { userId, category, amount, isAdding } = req.body;

  if (!userId || !category || amount === undefined) {
    return next(
      new AppError("User ID, category, and amount are required!", 400)
    );
  }

  const result = await budgetService.updateSpentAmount(
    userId,
    category,
    amount,
    isAdding
  );

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});
