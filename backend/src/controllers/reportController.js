const catchAsync = require("../utils/catchAsync");
const reportService = require("../services/reportService");

exports.getAnalyticsData = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extract from auth middleware
  const { timeframe } = req.query;

  // Validate timeframe
  if (!timeframe || !["weekly", "monthly"].includes(timeframe)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid timeframe. Must be either 'weekly' or 'monthly'",
    });
  }

  // Call the report service with the timeframe
  const analyticsData = await reportService.getAnalyticsData(userId, timeframe);

  res.status(200).json({
    status: "success",
    data: analyticsData,
  });
});
