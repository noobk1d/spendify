const catchAsync = require("../utils/catchAsync");
const transactionService = require("../services/transactionService");
const AppError = require("../utils/appError");

exports.addTransaction = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Retrieved from authentication middleware
  const transactionData = req.body;

  // Call service function to add transaction
  const { transaction, updatedWallet } =
    await transactionService.addTransaction(userId, transactionData);

  res.status(201).json({
    success: true,
    message: "Transaction added successfully",
    transaction,
    wallet: updatedWallet,
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const transactions = await transactionService.getTransactions(
    userId,
    req.query
  );

  res.status(200).json({
    status: "success",
    results: transactions.total,
    data: transactions.documents,
  });
});

exports.getTransactionById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});
