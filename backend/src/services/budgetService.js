const sdk = require("node-appwrite");
const { Query } = sdk;
const client = require("../config/appwrite");
const AppError = require("../utils/appError");

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const BUDGET_COLLECTION_ID = process.env.APPWRITE_BUDGET_COLLECTION_ID; // Stores totalBudget
const BUDGET_CATEGORIES_COLLECTION_ID =
  process.env.APPWRITE_BUDGET_CATEGORIES_COLLECTION_ID; // Stores category budgets

const databases = new sdk.Databases(client);
exports.getBudget = async (userId) => {
  try {
    // Fetch total budget
    const budgetData = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Fetch category budgets
    const categoryBudgets = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Extract total budget info
    const totalBudget =
      budgetData.documents.length > 0 ? budgetData.documents[0].totalBudget : 0;
    const totalSpent =
      budgetData.documents.length > 0 ? budgetData.documents[0].totalSpent : 0;

    // Extract category budget info
    const categories = categoryBudgets.documents.map((category) => ({
      id: category.$id,
      category: category.category,
      limit: category.limit,
      spent: category.spent,
      remaining: Math.max(0, category.limit - category.spent),
    }));

    return {
      totalBudget,
      totalSpent,
      remainingBudget: Math.max(0, totalBudget - totalSpent),
      categories,
    };
  } catch (error) {
    throw new AppError("Error fetching budget summary: " + error.message, 500);
  }
};

exports.setTotalBudget = async (userId, totalBudget) => {
  console.log("check");
  try {
    const existingBudget = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (existingBudget.documents.length > 0) {
      const budgetId = existingBudget.documents[0].$id;
      return await databases.updateDocument(
        DATABASE_ID,
        BUDGET_COLLECTION_ID,
        budgetId,
        { totalBudget }
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        BUDGET_COLLECTION_ID,
        "unique()",
        {
          userId,
          totalBudget,
          totalSpent: 0,
          monthlyReset: true,
        }
      );
    }
  } catch (error) {
    throw new AppError("Error setting total budget: " + error.message, 500);
  }
};

exports.setCategoryBudget = async (userId, category, limit) => {
  try {
    const existingCategory = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("category", category)]
    );

    if (existingCategory.documents.length > 0) {
      const categoryId = existingCategory.documents[0].$id;
      return await databases.updateDocument(
        DATABASE_ID,
        BUDGET_CATEGORIES_COLLECTION_ID,
        categoryId,
        { limit }
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        BUDGET_CATEGORIES_COLLECTION_ID,
        "unique()",
        {
          userId,
          category,
          limit,
          spent: 0,
          monthlyReset: true,
        }
      );
    }
  } catch (error) {
    console.log(error);
    throw new AppError("Error setting category budget: " + error.message, 500);
  }
};

exports.updateTotalBudget = async (userId, newTotalBudget) => {
  try {
    return await this.setTotalBudget(userId, newTotalBudget);
  } catch (error) {
    throw new AppError("Failed to update total budget: " + error.message, 500);
  }
};

exports.updateCategoryBudget = async (userId, category, newLimit) => {
  try {
    const existingCategory = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("category", category)]
    );

    if (existingCategory.documents.length === 0) {
      throw new AppError("Category budget not found", 404);
    }

    const categoryId = existingCategory.documents[0].$id;
    return await databases.updateDocument(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      categoryId,
      { limit: newLimit }
    );
  } catch (error) {
    throw new AppError(
      "Failed to update category budget: " + error.message,
      500
    );
  }
};

exports.deleteCategoryBudget = async (userId, budgetId) => {
  try {
    // Ensure budget exists
    const budget = await databases.getDocument(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      budgetId
    );

    if (!budget || budget.userId !== userId) {
      throw new AppError("Budget not found or unauthorized", 404);
    }

    await databases.deleteDocument(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      budgetId
    );
    return { message: "Category budget deleted successfully" };
  } catch (error) {
    throw new AppError(
      "Failed to delete category budget: " + error.message,
      500
    );
  }
};

exports.updateSpentAmount = async (
  userId,
  category,
  amount,
  isAdding = true
) => {
  try {
    // Get the category budget if it exists
    const categoryBudget = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_CATEGORIES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("category", category)]
    );

    if (categoryBudget.documents.length > 0) {
      const budget = categoryBudget.documents[0];
      const updatedSpent = isAdding
        ? budget.spent + amount
        : Math.max(0, budget.spent - amount);

      // Update the category budget
      await databases.updateDocument(
        DATABASE_ID,
        BUDGET_CATEGORIES_COLLECTION_ID,
        budget.$id,
        {
          spent: updatedSpent,
        }
      );
    }

    // Get the total budget if it exists
    const totalBudget = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (totalBudget.documents.length > 0) {
      const budget = totalBudget.documents[0];
      const updatedTotalSpent = isAdding
        ? budget.totalSpent + amount
        : Math.max(0, budget.totalSpent - amount);

      // Update the total budget
      await databases.updateDocument(
        DATABASE_ID,
        BUDGET_COLLECTION_ID,
        budget.$id,
        {
          totalSpent: updatedTotalSpent,
        }
      );
    }
    return { message: "Spent amount updated successfully" };
  } catch (error) {
    throw new AppError("Error updating spent amount: " + error.message, 500);
  }
};
