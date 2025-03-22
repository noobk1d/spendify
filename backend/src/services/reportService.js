const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");
const { Query } = sdk;

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TRANSACTIONS_COLLECTION = process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID;
const BUDGET_COLLECTION = process.env.APPWRITE_BUDGET_COLLECTION_ID;

// Function to fetch reports with filters
exports.getDashboardReports = async (
  userId,
  filterType,
  startDate,
  endDate
) => {
  try {
    let queryFilters = [Query.equal("userId", userId)];

    // Apply filters based on user selection
    const today = new Date();
    if (filterType === "weekly") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      queryFilters.push(Query.greaterThanEqual("date", lastWeek.toISOString()));
    } else if (filterType === "monthly") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      queryFilters.push(
        Query.greaterThanEqual("date", firstDayOfMonth.toISOString())
      );
    } else if (filterType === "custom" && startDate && endDate) {
      queryFilters.push(Query.greaterThanEqual("date", startDate));
      queryFilters.push(Query.lessThanEqual("date", endDate));
    }

    // Fetch transactions based on filters
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION,
      queryFilters
    );
    // console.log(transactions);
    if (!transactions.documents.length) {
      return {
        incomeVsExpense: [],
        categoryChart: [],
        budgetVsActual: [],
        spendingHeatmap: [],
        financialSummary: { totalIncome: 0, totalExpenses: 0, netSavings: 0 },
        monthlyTrends: [],
      };
    }

    let incomeVsExpense = {};
    let categoryChart = {};
    let spendingHeatmap = {};
    let totalIncome = 0;
    let totalExpenses = 0;
    const dailyTrends = {};

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in days
    // const dateDiff = (end - start) / (1000 * 60 * 60 * 24);
    transactions.documents.forEach((txn) => {
      const month = txn.date.substring(0, 7); // YYYY-MM
      const day = txn.date.substring(0, 10); // YYYY-MM-DD
      const amount = txn.amount;

      // Determine grouping based on filterType
      const key = filterType === "monthly" ? month : day;

      // Income vs Expense Graph
      if (!incomeVsExpense[key]) {
        incomeVsExpense[key] = { income: 0, expense: 0 };
      }
      if (txn.type === "income") {
        incomeVsExpense[key].income += amount;
        totalIncome += amount;
      } else {
        incomeVsExpense[key].expense += amount;
        totalExpenses += amount;
      }

      // Spending Heatmap (only for expenses)
      if (!spendingHeatmap[day]) {
        spendingHeatmap[day] = 0;
      }
      if (txn.type === "expense") {
        spendingHeatmap[day] += amount;
      }

      // Daily Trends (category-wise income/expense)
      if (!dailyTrends[day]) {
        dailyTrends[day] = { income: {}, expense: {} };
      }
      if (amount > 1000) {
        if (txn.type === "income") {
          dailyTrends[day].income[txn.category] =
            (dailyTrends[day].income[txn.category] || 0) + amount;
        } else {
          dailyTrends[day].expense[txn.category] =
            (dailyTrends[day].expense[txn.category] || 0) + amount;
        }
      }
    });

    // Fetch Budget Data
    const budgets = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION,
      [Query.equal("userId", userId)]
    );

    if (!budgets.documents.length) {
      throw new Error("No budget data found");
    }

    const budgetData = budgets.documents[0]; // Assuming one entry per user

    const budgetVsActual = {
      budget: budgetData.totalBudget,
      spent: totalExpenses,
      remaining: Math.max(0, budgetData.totalBudget - totalExpenses),
    };

    // const budgets = await databases.listDocuments(
    //   DATABASE_ID,
    //   BUDGET_COLLECTION,
    //   [Query.equal("userId", userId)]
    // );

    // let budgetVsActual = budgets.documents.map((budget) => ({
    //   category: budget.category,
    //   budget: budget.limit,
    //   spent: budget.spent,
    //   remaining: Math.max(0, budget.limit - budget.spent),
    // }));

    return {
      incomeVsExpense: Object.entries(incomeVsExpense).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      })),
      // categoryChart: Object.entries(categoryChart).map(
      //   ([category, amount]) => ({
      //     category,
      //     amount,
      //   })
      // ),
      budgetVsActual,
      spendingHeatmap: Object.entries(spendingHeatmap).map(([day, amount]) => ({
        date: day,
        amount,
      })),
      financialSummary: {
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
      },
      monthlyTrends: dailyTrends,
    };
  } catch (error) {
    throw new AppError(
      "Error generating dashboard reports: " + error.message,
      500
    );
  }
};
