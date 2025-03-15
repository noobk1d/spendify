const catchAsync = require("../utils/catchAsync");
const walletService = require("../services/walletService");
const AppError = require("../utils/appError");

exports.createUserWallet = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extracted from session/JWT middleware

  if (!userId) return next(new AppError("Unauthorized!", 400));

  const profile = await walletService.createUserWallet(userId);
  return res.status(200).json({
    status: "success",
    message: "Wallet Created Successfully!",
    totalBalance: profile.totalBalance,
    allocations: JSON.parse(profile.allocations),
  });
});

exports.getUserWallet = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extracted from session/JWT middleware

  if (!userId) return next(new AppError("Unauthorized!", 400));

  const wallet = await walletService.getUserWallet(userId);
  return res.status(200).json(wallet);
});

exports.updateUserWallet = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extracted from session/JWT middleware
  const updateData = req.body;
  if (!userId) return next(new AppError("Unauthorized!", 400));

  const wallet = await walletService.updateUserWallet(userId, updateData);
  return res.status(200).json(wallet);
});
