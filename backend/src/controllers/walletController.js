const catchAsync = require("../utils/catchAsync");
const walletService = require("../services/walletService");
const AppError = require("../utils/appError");

exports.createUserWallet = catchAsync(async (req, res, next) => {
  const userId = req.user; // Extracted from session/JWT middleware
  const { cash, bank } = req.body;

  if (!userId) return next(new AppError("Unauthorized!", 400));
  if (!cash && !bank)
    return next(
      new AppError("Please provide at least one allocation (cash or bank)", 400)
    );

  const profile = await walletService.createUserWallet(userId, { cash, bank });
  return res.status(200).json({
    status: "success",
    message: "Wallet Created Successfully!",
    data: profile,
  });
});

exports.getUserWallet = catchAsync(async (req, res, next) => {
  const userId = req.user; // Extracted from session/JWT middleware

  if (!userId) return next(new AppError("Unauthorized!", 400));

  const wallet = await walletService.getUserWallet(userId);
  return res.status(200).json({
    status: "success",
    message: "Wallet retrieved successfully",
    data: wallet,
  });
});

exports.updateUserWallet = catchAsync(async (req, res, next) => {
  const userId = req.user; // Extracted from session/JWT middleware
  const updateData = req.body;
  if (!userId) return next(new AppError("Unauthorized!", 400));

  const wallet = await walletService.updateUserWallet(userId, updateData);
  return res.status(200).json({
    status: "success",
    message: "Wallet updated successfully",
    data: wallet,
  });
});
