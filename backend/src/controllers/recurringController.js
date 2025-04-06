const recurringService = require("../services/recurringService");
const catchAsync = require("../utils/catchAsync");

// ✅ Add a recurring transaction
exports.addRecurringTransaction = catchAsync(async (req, res) => {
  const userId = req.user;
  const transaction = await recurringService.addRecurringTransaction(
    req.body,
    userId
  );
  res.status(201).json(transaction);
});

// ✅ Get all recurring transactions
exports.getRecurringTransactions = catchAsync(async (req, res) => {
  const userId = req.user;
  const transactions = await recurringService.getRecurringTransactions(userId);
  res.status(200).json(transactions);
});

// ✅ Pause a recurring transaction
exports.pauseRecurringTransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  if (!id || !userId) {
    return next(new AppError("Transaction ID and User ID are required", 400));
  }
  const updatedTransaction = await recurringService.pauseRecurringTransaction(
    id,
    userId
  );
  res.status(200).json(updatedTransaction);
});

// ✅ Resume a recurring transaction
exports.resumeRecurringTransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  if (!id || !userId) {
    return next(new AppError("Transaction ID and User ID are required", 400));
  }
  const updatedTransaction = await recurringService.resumeRecurringTransaction(
    id,
    userId
  );
  res.status(200).json(updatedTransaction);
});

// ✅ Delete a recurring transaction
exports.deleteRecurringTransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  if (!transactionId || !userId) {
    return next(new AppError("Transaction ID and User ID are required", 400));
  }
  await recurringService.deleteRecurringTransaction(id, userId);
  res.status(200).json({ message: "Transaction deleted successfully" });
});
