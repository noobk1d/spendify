const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboardService");
const AppError = require("../utils/appError");

exports.getDashboardData = catchAsync(async (req, res, next) => {
  const userId = req.user;

  let { filterType } = req.query;
  const today = new Date();
  let startDate, endDate;

  if (filterType === "weekly") {
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    startDate = lastWeek.toISOString();
    endDate = today.toISOString();
  } else if (filterType === "monthly") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = firstDayOfMonth.toISOString();
    endDate = today.toISOString();
  } else {
    return next(
      new AppError("Invalid filter type! Use 'weekly' or 'monthly'", 400)
    );
  }

  const dashboardData = await dashboardService.getDashboardData(
    userId,
    startDate,
    endDate,
    filterType
  );
  res.status(200).json({
    status: "success",
    data: dashboardData,
  });
});
