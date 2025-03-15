const catchAsync = require("../utils/catchAsync");
const reportService = require("../services/reportService");

exports.getDashboardReports = catchAsync(async (req, res, next) => {
  const { userId } = req.params; // Extract from auth middleware
  let { filterType, startDate, endDate } = req.query;

  // 🔹 Define startDate & endDate dynamically if not provided
  const today = new Date();

  if (filterType === "weekly") {
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    startDate = lastWeek.toISOString();
    endDate = today.toISOString();
  } else if (filterType === "monthly") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = firstDayOfMonth.toISOString();
    endDate = today.toISOString();
  }

  // 🔹 Call the report service with the calculated startDate and endDate
  const reportData = await reportService.getDashboardReports(
    userId,
    filterType,
    startDate,
    endDate
  );

  res.status(200).json({
    status: "success",
    data: reportData,
  });
});
