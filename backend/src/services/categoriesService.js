const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");
const { Query } = sdk;

const databases = new sdk.Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_CATEGORIES_COLLECTION_ID;

// ✅ Get all categories (default + user-specific)
exports.getCategories = async (userId) => {
  try {
    // Fetch default categories (userId = null) and user's custom categories
    const categories = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", ["null", userId])]
    );
    return categories.documents;
  } catch (error) {
    throw new AppError("Failed to fetch categories: " + error.message, 400);
  }
};

// ✅ Add a new user-specific category
exports.addCategory = async (userId, categoryName, type) => {
  try {
    // Step 1: Check if category already exists (either default or user-specific)
    const existingCategory = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        sdk.Query.equal("name", categoryName), // Check by category name
        sdk.Query.equal("userId", [userId, "null"]), // Check user-specific & default categories
      ]
    );

    // Step 2: If found, prevent duplicate insertion
    if (existingCategory.documents.length > 0) {
      throw new AppError("Category already exists.", 400);
    }

    // Step 3: Add the new category
    const newCategory = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      { name: categoryName, userId, type }
    );

    return newCategory;
  } catch (error) {
    throw new AppError("Failed to add category: " + error.message, 400);
  }
};

// ✅ Delete a user-added category
exports.deleteCategory = async (userId, name) => {
  try {
    // Ensure the category belongs to the user and isn't a default category
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("name", name),
      Query.equal("userId", userId), // Ensure it's a user-added category
    ]);

    if (response.documents.length === 0) {
      throw new Error("Category not found or not deletable.");
    }

    const documentId = response.documents[0].$id;

    // Step 2: Delete the document using its ID
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    return true;
  } catch (error) {
    throw new AppError("Failed to delete category: " + error.message, 400);
  }
};
