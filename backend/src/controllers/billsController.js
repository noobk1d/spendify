const billsService = require("../services/billsService");
const catchAsync = require("../utils/catchAsync");

exports.addBill = catchAsync(async (req, res) => {
  const { name, category, amount, dueDate, status } = req.body;
  const userId = req.user;

  const bill = await billsService.createBill(
    userId,
    name,
    category,
    amount,
    dueDate,
    status
  );
  res.status(201).json(bill);
});

exports.getAllBills = catchAsync(async (req, res) => {
  const userId = req.user;
  const bills = await billsService.fetchAllBills(userId);
  res.status(200).json(bills);
});

exports.updateBill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedBill = await billsService.modifyBill(id, updateData);
  res.status(200).json(updatedBill);
});

exports.deleteBill = catchAsync(async (req, res) => {
  const { id } = req.params;
  await billsService.removeBill(id);
  res.json({ message: "Bill deleted successfully" });
});

exports.getUpcomingBills = catchAsync(async (req, res) => {
  const userId = req.user;
  const upcomingBills = await billsService.fetchUpcomingBill(userId);
  res.status(200).json(upcomingBills);
});

exports.getTotalBillsSummary = catchAsync(async (req, res) => {
  const userId = req.user;
  const summary = await billsService.fetchBillsSummary(userId);
  res.status(200).json(summary);
});
