const catchAsync = require("../utils/catchAsync");
const profileService = require("../services/profileService");
const AppError = require("../utils/appError");

exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user; // Extracted from session/JWT middleware
  console.log(userId);

  if (!userId) return next(new AppError("Unauthorized!", 400));

  const profile = await profileService.getUserProfile(userId);
  return res.status(200).json({
    status: "success",
    message: "Profile retrieved successfully",
    data: profile,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user; // Comes from authentication middleware
  const updateData = req.body; // Data sent from frontend

  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized access",
    });
  }

  const updatedProfile = await profileService.updateUserProfile(
    userId,
    updateData
  );

  return res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});
