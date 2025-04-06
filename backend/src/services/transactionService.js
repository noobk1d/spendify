const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");
const walletService = require("./walletService");
const budgetService = require("./budgetService"); // ✅ Import budget service
const { Query } = sdk;

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID;

exports.addTransaction = async (userId, transactionData) => {
  try {
    const { amount, type, paymentMethod, category, note, date } =
      transactionData;

    // 🔹 Validate transaction type
    if (!["income", "expense"].includes(type)) {
      throw new AppError("Invalid transaction type!");
    }

    // 🔹 Create transaction entry in Appwrite Database
    const transaction = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      "unique()",
      {
        userId,
        amount,
        type,
        paymentMethod,
        category,
        note,
        date: date || new Date().toISOString(),
      }
    );

    let updateWallet = {};
    if (category === "creditCardPayment") {
      updateWallet = {
        mode: "transaction",
        [paymentMethod]: amount,
        type,
        creditCard: amount,
        category: "creditCardPayment",
      };
    } else {
      updateWallet = { mode: "transaction", [paymentMethod]: amount, type };
    }

    // 🔄 Update Wallet Balance via Wallet Service
    const updatedWallet = await walletService.updateUserWallet(
      userId,
      updateWallet
    );

    // ✅ Update Spent Amount in Budget (Only for expenses)
    if (type === "expense") {
      await budgetService.updateSpentAmount(userId, category, amount, true);
    }

    return { transaction, updatedWallet };
  } catch (error) {
    throw new AppError(`Error adding transaction + ${error.message}`, 400);
  }
};

exports.updateTransaction = async (transactionId, userId, updatedData) => {
  try {
    // Fetch the existing transaction
    const existingTransaction = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      transactionId
    );

    if (!existingTransaction || existingTransaction.userId !== userId) {
      throw new AppError("Transaction not found or unauthorized", 404);
    }

    const { amount, category, type } = updatedData;
    const oldAmount = existingTransaction.amount;
    const oldCategory = existingTransaction.category;

    // ✅ Adjust Budget Spent Amount
    if (type === "expense") {
      await budgetService.updateSpentAmount(
        userId,
        oldCategory,
        oldAmount,
        false
      ); // Subtract old amount
      await budgetService.updateSpentAmount(userId, category, amount, true); // Add new amount
    }

    // 🔄 Update Transaction in Database
    const updatedTransaction = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      transactionId,
      updatedData
    );

    return updatedTransaction;
  } catch (error) {
    throw new AppError(`Error updating transaction: ${error.message}`, 400);
  }
};

exports.deleteTransaction = async (transactionId, userId) => {
  try {
    // Fetch the existing transaction
    const transaction = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      transactionId
    );

    if (!transaction || transaction.userId !== userId) {
      throw new AppError("Transaction not found or unauthorized", 404);
    }

    // ✅ Adjust Budget Spent Amount
    if (transaction.type === "expense") {
      await budgetService.updateSpentAmount(
        userId,
        transaction.category,
        transaction.amount,
        false
      );
    }

    // 🔄 Delete Transaction from Database
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, transactionId);

    return { message: "Transaction deleted successfully" };
  } catch (error) {
    throw new AppError(`Error deleting transaction: ${error.message}`, 400);
  }
};

exports.getTransactions = async (userId, filters) => {
  try {
    console.log(filters);
    let queryFilters = [];
    queryFilters.push(Query.equal("userId", userId));

    // 🔹 Apply Date Filters Based on `filterType`
    const currentDate = new Date();
    if (filters.filterType === "weekly") {
      let startDate = new Date();
      startDate.setDate(currentDate.getDate() - 7); // Last 7 days
      queryFilters.push(
        Query.greaterThanEqual("date", startDate.toISOString())
      );
      queryFilters.push(Query.lessThanEqual("date", currentDate.toISOString()));
    } else if (filters.filterType === "monthly") {
      let startDate = new Date();
      startDate.setMonth(currentDate.getMonth() - 1); // Last 1 month
      queryFilters.push(
        Query.greaterThanEqual("date", startDate.toISOString())
      );
      queryFilters.push(Query.lessThanEqual("date", currentDate.toISOString()));
    } else if (
      filters.filterType === "custom" &&
      filters.startDate &&
      filters.endDate
    ) {
      queryFilters.push(Query.greaterThanEqual("date", filters.startDate));
      queryFilters.push(Query.lessThanEqual("date", filters.endDate));
    }

    // 🔹 Apply Additional Filters
    if (filters.category) {
      queryFilters.push(Query.equal("category", filters.category));
    }
    if (filters.paymentMethod) {
      queryFilters.push(Query.equal("paymentMethod", filters.paymentMethod));
    }
    if (filters.minAmount) {
      queryFilters.push(Query.greaterThanEqual("amount", filters.minAmount));
    }
    if (filters.maxAmount) {
      queryFilters.push(Query.lessThanEqual("amount", filters.maxAmount));
    }

    // 🔹 Fetch Transactions from Appwrite Database
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        ...queryFilters,
        Query.orderDesc("date"), // or Query.orderAsc("date") for oldest first
      ]
    );

    return transactions;
  } catch (error) {
    throw new AppError(`Error retrieving transactions: ${error.message}`);
  }
};

exports.getTransactionById = async (transactionId) => {
  try {
    const transaction = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      transactionId
    );

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    return transaction;
  } catch (error) {
    throw new AppError(`Error retrieving transaction: ${error.message}`, 400);
  }
};
