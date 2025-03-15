const sdk = require("node-appwrite");
const { Query } = sdk;
const client = require("../config/appwrite");
const AppError = require("../utils/appError");

const databases = new sdk.Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_BILLS_COLLECTION_ID;

exports.createBill = async (
  userId,
  name,
  category,
  amount,
  dueDate,
  status
) => {
  try {
    const bill = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      "unique()",
      { userId, name, category, amount, dueDate, status: status || "Unpaid" }
    );
    return bill;
  } catch (error) {
    throw new AppError(`Error Creating new Bill: ${error.message}`, 400);
  }
};

exports.fetchAllBills = async (userId) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("dueDate"),
    ]);
    const bills = response.documents;
    return bills;
  } catch (error) {
    throw new AppError(`Error Fetching Bills: ${error.message}`, 400);
  }
};

exports.modifyBill = async (billId, updateData) => {
  try {
    const updatedBill = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      billId,
      updateData
    );
    return updatedBill;
  } catch (error) {
    throw new AppError(`Error Modifying Bill: ${error.message}`, 400);
  }
};

exports.removeBill = async (userId, billId) => {
  try {
    const bill = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      billId
    );
    if (bill.userId !== userId) {
      throw new AppError(
        "Unauthorized: You can only delete your own bills.",
        403
      );
    }
    const deletedBill = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      billId
    );
    return deletedBill;
  } catch (error) {
    throw new AppError(`Error Removing Bill: ${error.message}`, 400);
  }
};

exports.fetchUpcomingBill = async (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("status", "Pending"), // Only fetch pending bills
      Query.greaterThanEqual("dueDate", today),
      Query.orderAsc("dueDate"), // Order by closest due date
      Query.limit(1), // Fetch only the next bill
    ]);

    const nextBill =
      response.documents.length > 0 ? response.documents[0] : null;
    return nextBill;
  } catch (error) {
    throw new AppError(
      `Error Fetching Next Pending Bill: ${error.message}`,
      400
    );
  }
};

exports.fetchBillsSummary = async (userId) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);

    let totalBills = 0;
    let totalPaid = 0;

    response.documents.forEach((bill) => {
      totalBills += bill.amount;
      if (bill.status === "Paid") {
        totalPaid += bill.amount;
      }
    });

    const summary = {
      total: totalBills,
      paid: totalPaid,
      progress: totalBills > 0 ? (totalPaid / totalBills) * 100 : 0,
    };

    return summary;
  } catch (error) {
    throw new AppError(`Error Fetching Bills Summary: ${error.message}`, 400);
  }
};
