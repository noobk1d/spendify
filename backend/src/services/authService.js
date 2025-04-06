const sdk = require("node-appwrite");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");

dotenv.config({ path: "./config.env" });

const account = new sdk.Account(client);
const databases = new sdk.Databases(client);

exports.createUser = async (name, email, phone, password) => {
  try {
    // ✅ Create the user in Appwrite Authentication
    const user = await account.create(sdk.ID.unique(), email, password);

    // ✅ Store additional user details in the database
    const userRecord = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID, // Your database ID
      process.env.APPWRITE_USERS_COLLECTION_ID, // Your users collection ID
      user.$id,
      {
        userId: user.$id,
        email: email,
        name: name, // Added name field
        phone: phone,
      }
    );
    return { userId: user.$id, email: user.email }; // Return only the necessary fields
  } catch (error) {
    throw new AppError(error.message, 409);
  }
};

exports.loginUser = async (email, password) => {
  try {
    // Create an email/password session
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error.message);
    throw new AppError(error.message, 401);
  }
};
