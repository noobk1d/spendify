const catchAsync = require("../utils/catchAsync");
const profileService = require("../services/profileService");
const AppError = require("../utils/appError");

exports.getMe = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extracted from session/JWT middleware
  console.log(userId);

  if (!userId) return next(new AppError("Unauthorized!", 400));

  const profile = await profileService.getUserProfile(userId);
  return res.status(200).json(profile);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Comes from authentication middleware
  const updateData = req.body; // Data sent from frontend

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const updatedProfile = await profileService.updateUserProfile(
    userId,
    updateData
  );

  return res.status(200).json({
    message: "Profile updated successfully",
    profile: updatedProfile,
  });
});
