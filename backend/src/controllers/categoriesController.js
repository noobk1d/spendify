const catchAsync = require("../utils/catchAsync");
const categoriesService = require("../services/categoriesService");
const AppError = require("../utils/appError");

// ✅ GET /categories → Fetch all categories (default + user-specific)
exports.getCategories = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Assume user ID is attached from authentication middleware
  const categories = await categoriesService.getCategories(userId);
  res.status(200).json(categories);
});

// ✅ POST /categories/add → Add a new user-specific category
exports.addCategory = catchAsync(async (req, res, next) => {
  const { name, type } = req.body;
  const { userId } = req.params; // Extract user ID from token

  if (!name || !type) {
    return next(new AppError("Name and type are required!", 400));
  }

  const category = await categoriesService.addCategory(userId, name, type);
  res.status(201).json(category);
});

// ✅ DELETE /categories/{id} → Delete a user-added category
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const name = req.body.name; // Extract user ID from token

  const deleted = await categoriesService.deleteCategory(userId, name);
  if (!deleted) {
    return next(new AppError("Category not found or cannot be deleted!", 404));
  }

  res.status(200).json({ message: "Category deleted successfully" });
});
