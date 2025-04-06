const sdk = require("node-appwrite");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_WALLETS_COLLECTION_ID;
exports.createUserWallet = async (docId, { cash = 0, bank = 0 }) => {
  try {
    // Calculate total balance
    const totalBalance = Number(cash) + Number(bank);

    // Create allocations object
    const allocations = {
      cash: Number(cash),
      bank: Number(bank),
      creditCard: 0, // Initialize credit card to 0
    };

    const wallet = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      docId,
      {
        userId: docId,
        totalBalance,
        allocations: JSON.stringify(allocations),
      }
    );
    return wallet;
  } catch (error) {
    throw new AppError("Error creating wallet: " + error.message);
  }
};

exports.getUserWallet = async (documentId) => {
  try {
    const wallet = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );

    if (!wallet) {
      return next(new AppError("Wallet not found!", 404));
    }
    return wallet;
  } catch (error) {
    throw new AppError("Error fetching wallet: " + error.message);
  }
};

exports.updateUserWallet = async (docId, updateData) => {
  try {
    // Fetch current wallet data
    const walletDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      docId
    );
    if (!walletDoc.allocations) {
      throw new Error("Wallet allocations not found");
    }

    let wallet = JSON.parse(walletDoc.allocations); // Ensure wallet is mutable
    console.log(updateData);
    // Update fields dynamically

    if (updateData.mode === "transaction") {
      console.log("transaction");
      if (updateData.type) {
        if (updateData.type === "income") {
          wallet.cash = (wallet.cash || 0) + (updateData.cash || 0);
          wallet.bank = (wallet.bank || 0) + (updateData.bank || 0);
        } else if (updateData.type === "expense") {
          wallet.cash = (wallet.cash || 0) - (updateData.cash || 0);
          wallet.bank = (wallet.bank || 0) - (updateData.bank || 0);

          if (updateData.creditCard) {
            if (wallet.creditCard === 0) {
              throw new AppError(
                "Credit card already paid off. No payment required.",
                400
              );
            }
            // Reduce debt (increase towards zero)
            wallet.creditCard =
              (wallet.creditCard || 0) + Math.abs(updateData.creditCard || 0);
            console.log("wallet" + wallet.creditCard);
          } else {
            // Increase debt (moving more negative)
            wallet.creditCard =
              (wallet.creditCard || 0) - Math.abs(updateData.creditCard || 0);
          }
        }
      } else {
        wallet.cash = (wallet.cash || 0) + (updateData.cash || 0);
        wallet.bank = (wallet.bank || 0) + (updateData.bank || 0);
        wallet.creditCard =
          (wallet.creditCard || 0) - (updateData.creditCard || 0);
      }
    } else {
      wallet.cash = updateData.cash;
      wallet.bank = updateData.bank;
      wallet.creditCard = updateData.creditCard;
    }

    // 🔹 Calculate total balance (Cash + Bank - Credit Card Debt)
    const totalBalance =
      wallet.cash + wallet.bank - Math.abs(wallet.creditCard);
    console.log(totalBalance);
    // Update in database
    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      docId,
      {
        allocations: JSON.stringify(wallet), // Store updated allocations
        totalBalance: totalBalance, // Store total balance separately
      }
    );

    return updatedDoc;
  } catch (error) {
    console.log("Wallet" + error);
    throw new AppError(`Error updating wallet`, 400);
  }
};
