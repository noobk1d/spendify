const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");

const account = new sdk.Account(client);
const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

exports.getUserProfile = async (userId) => {
  try {
    const userProfile = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId
    );

    if (!userProfile) throw new Error("User profile not found");

    return {
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location,
      //   walletAllocation: userProfile.walletAllocation || [],
      //   categories: userProfile.categories || [],
      //   bills: userProfile.bills || [],
      //   debts: userProfile.debts || [],
    };
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    throw new AppError("Error Fetching profile: " + error.message);
  }
};

exports.updateUserProfile = async (userId, updateData) => {
  try {
    // Fetch existing user profile
    const userProfile = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId
    );

    if (!userProfile) {
      throw new Error("User profile not found", 400);
    }
    // if (updateData.name) {
    //   await account.updateName(updateData.name);
    // }

    // Update profile in Appwrite Database
    const updatedProfile = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      userId,
      updateData
    );

    return updatedProfile;
  } catch (error) {
    throw new AppError("Error updating profile: " + error.message);
  }
};
