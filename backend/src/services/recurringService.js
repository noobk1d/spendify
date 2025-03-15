const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");
const moment = require("moment-timezone");
const { Query } = sdk;
const transsactionService = require("./transactionService");
// const { v4: uuidv4 } = require("uuid");

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const RECURRING_COLLECTION_ID = process.env.APPWRITE_RECURRING_COLLECTION_ID;
const TRANSACTION_COLLECTION_ID =
  process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID;

const databases = new sdk.Databases(client);
// ✅ Add a recurring transaction

exports.addRecurringTransaction = async (data, userId) => {
  try {
    const newTransaction = await databases.createDocument(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      "unique()",
      {
        userId,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        paymentMethod: data.paymentMethod,
        recurrenceInterval: data.recurrence.interval, // Storing interval as a separate field
        recurrenceStartDate: data.recurrence.startDate, // Storing start date separately
        recurrenceEndDate: data.recurrence.endDate || null, // Optional end date
        nextExecutionDate: data.recurrence.startDate, // First execution
        status: "active",
        note: data.note || "",
      }
    );
    return newTransaction;
  } catch (error) {
    throw new AppError("Error adding recurring transaction: " + error.message);
  }
};

// ✅ Get all recurring transactions for a user
exports.getRecurringTransactions = async (userId) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
    return transactions.documents;
  } catch (error) {
    throw new AppError("Error retrieving transactions: " + error.message);
  }
};

// ✅ Pause a recurring transaction
exports.pauseRecurringTransaction = async (transactionId, userId) => {
  console.log(2);
  try {
    if (!transactionId || !userId)
      throw new Error("Transaction ID and User ID are required");

    // Fetch the transaction first
    const transaction = await databases.getDocument(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      transactionId
    );

    // Check if the transaction belongs to the user
    if (transaction.userId !== userId) {
      throw new Error("Unauthorized: This transaction does not belong to you");
    }

    // Update status to 'paused'
    const updatedTransaction = await databases.updateDocument(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      transactionId,
      { status: "paused" }
    );

    return updatedTransaction;
  } catch (error) {
    throw new AppError("Error pausing transaction " + error.message, 400);
  }
};

exports.resumeRecurringTransaction = async (transactionId, userId) => {
  if (!transactionId || !userId)
    throw new Error("Transaction ID and User ID are required");

  // Fetch the transaction first
  const transaction = await databases.getDocument(
    DATABASE_ID,
    RECURRING_COLLECTION_ID,
    transactionId
  );

  // Check if the transaction belongs to the user
  if (transaction.userId !== userId) {
    throw new Error("Unauthorized: This transaction does not belong to you");
  }

  // Update status to 'active'
  const updatedTransaction = await databases.updateDocument(
    DATABASE_ID,
    RECURRING_COLLECTION_ID,
    transactionId,
    { status: "active" }
  );

  return updatedTransaction;
};

// ✅ Delete a recurring transaction
exports.deleteRecurringTransaction = async (transactionId, userId) => {
  try {
    // Fetch the transaction to verify ownership
    const transaction = await databases.getDocument(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      transactionId
    );

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    // Ensure the transaction belongs to the requesting user
    if (transaction.userId !== userId) {
      throw new AppError(
        "Unauthorized: You cannot delete this transaction",
        403
      );
    }
    // Proceed with deletion
    await databases.deleteDocument(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      transactionId
    );
  } catch (error) {
    throw new AppError("Error deleting transaction: " + error.message, 400);
  }
};

exports.processRecurringTransactions = async () => {
  console.log("recurring");
  try {
    // Get today's date in YYYY-MM-DD format
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // Fetch all active recurring transactions where `nextExecutionDate` is today
    const recurringTransactions = await databases.listDocuments(
      DATABASE_ID,
      RECURRING_COLLECTION_ID,
      [Query.equal("nextExecutionDate", today), Query.equal("status", "active")]
    );
    // console.log(recurringTransactions);

    if (recurringTransactions.documents.length === 0) {
      console.log("✅ No pending recurring transactions today.");
      return;
    }

    // Process each transaction
    for (const transaction of recurringTransactions.documents) {
      // Add a new transaction entry in transactions collection

      const transactionData = {
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        paymentMethod: transaction.paymentMethod,
        note: transaction.note,
        date: transaction.nextExecutionDate || new Date().toISOString(),
      };
      const userId = transaction.userId;
      let completedTransaction = transsactionService.addTransaction(
        userId,
        transactionData
      );
      // Calculate next execution date
      const nextExecutionDate = calculateNextExecutionDate(
        transaction.nextExecutionDate,
        transaction.frequency
      );

      // Update the recurring transaction with the next execution date
      if (nextExecutionDate) {
        await databases.updateDocument(
          DATABASE_ID,
          RECURRING_COLLECTION_ID,
          transaction.$id,
          { nextExecutionDate }
        );
      } else {
        // If no next execution date, mark as completed
        await databases.updateDocument(
          DATABASE_ID,
          RECURRING_COLLECTION_ID,
          transaction.$id,
          { status: "completed" }
        );
      }
    }

    console.log(
      `✅ Processed ${recurringTransactions.documents.length} recurring transactions.`
    );
  } catch (error) {
    console.error("❌ Error processing recurring transactions:" + error, 400);
  }
};

// Function to calculate the next execution date
const calculateNextExecutionDate = (currentDate, frequency) => {
  const date = moment(currentDate, "YYYY-MM-DD");

  switch (frequency) {
    case "daily":
      return date.add(1, "days").format("YYYY-MM-DD");
    case "weekly":
      return date.add(1, "weeks").format("YYYY-MM-DD");
    case "monthly":
      return date.add(1, "months").format("YYYY-MM-DD");
    case "yearly":
      return date.add(1, "years").format("YYYY-MM-DD");
    default:
      return null;
  }
};
