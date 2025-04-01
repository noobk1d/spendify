const sdk = require("node-appwrite");
const client = require("../config/appwrite");
const AppError = require("../utils/appError");
const { Query } = sdk;

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TRANSACTIONS_COLLECTION = process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID;
const BUDGET_COLLECTION = process.env.APPWRITE_BUDGET_COLLECTION_ID;

// Helper function to get date range based on timeframe
const getDateRange = (timeframe) => {
  const today = new Date();
  let startDate, endDate;

  if (timeframe === "weekly") {
    // Get start of current week (Monday)
    startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() + 1);
    startDate.setHours(0, 0, 0, 0);

    // Get end of current week (Sunday)
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Get start of current month
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    // Get end of current month
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

// Helper function to calculate trends
const calculateTrends = (currentData, previousData) => {
  const incomeTrend =
    previousData.totalIncome === 0
      ? 0
      : ((currentData.totalIncome - previousData.totalIncome) /
          previousData.totalIncome) *
        100;

  const expenseTrend =
    previousData.totalExpenses === 0
      ? 0
      : ((currentData.totalExpenses - previousData.totalExpenses) /
          previousData.totalExpenses) *
        100;

  return {
    income: {
      percentage: Math.round(incomeTrend * 10) / 10,
      direction: incomeTrend >= 0 ? "up" : "down",
    },
    expenses: {
      percentage: Math.round(expenseTrend * 10) / 10,
      direction: expenseTrend >= 0 ? "up" : "down",
    },
  };
};

// Function to fetch analytics data
exports.getAnalyticsData = async (userId, timeframe) => {
  try {
    const { startDate, endDate } = getDateRange(timeframe);

    // Get current period transactions
    const currentTransactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION,
      [
        Query.equal("userId", userId),
        Query.greaterThanEqual("date", startDate.toISOString()),
        Query.lessThanEqual("date", endDate.toISOString()),
      ]
    );

    // Get previous period transactions for trend calculation
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(
      startDate.getDate() - (timeframe === "weekly" ? 7 : 30)
    );
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);

    const previousTransactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION,
      [
        Query.equal("userId", userId),
        Query.greaterThanEqual("date", previousStartDate.toISOString()),
        Query.lessThanEqual("date", previousEndDate.toISOString()),
      ]
    );

    // Process current period data
    const currentData = processTransactions(
      currentTransactions.documents,
      timeframe
    );
    const previousData = processTransactions(
      previousTransactions.documents,
      timeframe
    );

    // Get budget data
    const budgets = await databases.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION,
      [Query.equal("userId", userId)]
    );

    const budgetData = budgets.documents[0] || { totalBudget: 0 };

    // Calculate budget utilization
    const budgetUtilization =
      budgetData.totalBudget > 0
        ? (currentData.totalExpenses / budgetData.totalBudget) * 100
        : 0;

    // Prepare response
    const response = {
      timeframe,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      data: {
        summary: {
          totalIncome: currentData.totalIncome,
          totalExpenses: currentData.totalExpenses,
          netSavings: currentData.totalIncome - currentData.totalExpenses,
          budgetUtilization: Math.round(budgetUtilization * 10) / 10,
          trends: calculateTrends(currentData, previousData),
        },
        incomeExpense: {
          labels:
            timeframe === "weekly"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              : ["Week 1", "Week 2", "Week 3", "Week 4"],
          income: currentData.incomeData,
          expenses: currentData.expenseData,
        },
        budgetActual: {
          labels:
            timeframe === "weekly"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              : ["Week 1", "Week 2", "Week 3", "Week 4"],
          budget:
            timeframe === "weekly"
              ? Array(7).fill(budgetData.totalBudget / 7)
              : Array(4).fill(budgetData.totalBudget / 4),
          actual: currentData.expenseData,
        },
        dailyTrends: {
          labels:
            timeframe === "weekly"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              : ["Week 1", "Week 2", "Week 3", "Week 4"],
          data: currentData.dailyTrends.data,
          categories: currentData.dailyTrends.categories,
        },
        spendingHeatmap:
          timeframe === "weekly"
            ? {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                data: currentData.heatmapData,
              }
            : {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                data: currentData.heatmapData,
              },
      },
    };

    return response;
  } catch (error) {
    throw new AppError(
      "Error generating analytics data: " + error.message,
      500
    );
  }
};

// Helper function to process transactions
const processTransactions = (transactions, timeframe) => {
  const data = {
    totalIncome: 0,
    totalExpenses: 0,
    incomeData: [],
    expenseData: [],
    heatmapData: [],
    dailyTrends: {
      labels: [],
      data: [],
    },
  };

  // Initialize arrays based on timeframe
  const dataPoints = timeframe === "weekly" ? 7 : 4;
  data.incomeData = new Array(dataPoints).fill(0);
  data.expenseData = new Array(dataPoints).fill(0);
  data.heatmapData =
    timeframe === "weekly"
      ? new Array(dataPoints).fill(0)
      : Array(dataPoints)
          .fill()
          .map(() => new Array(7).fill(0));

  // Initialize daily trends data structure
  data.dailyTrends.labels =
    timeframe === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Week 1", "Week 2", "Week 3", "Week 4"];

  data.dailyTrends.data = new Array(dataPoints).fill().map(() => ({
    amount: 0,
    categories: [],
  }));

  // Group transactions by day/week
  const groupedTransactions = {};
  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    let key;

    if (timeframe === "weekly") {
      key = date.getDay() - 1; // Monday = 0, Sunday = 6
    } else {
      key = Math.floor((date.getDate() - 1) / 7); // Week number (0-3)
    }

    if (!groupedTransactions[key]) {
      groupedTransactions[key] = [];
    }
    groupedTransactions[key].push({ ...txn, date }); // Store the date with the transaction
  });

  // Process each day/week's transactions
  Object.entries(groupedTransactions).forEach(([key, dayTransactions]) => {
    const index = parseInt(key);
    let totalAmount = 0;
    const categoryTotals = {};

    dayTransactions.forEach((txn) => {
      const amount = txn.amount;

      if (txn.type === "income") {
        data.totalIncome += amount;
        data.incomeData[index] += amount;
      } else {
        data.totalExpenses += amount;
        data.expenseData[index] += amount;
        totalAmount += amount;

        // Track category totals
        if (!categoryTotals[txn.category]) {
          categoryTotals[txn.category] = 0;
        }
        categoryTotals[txn.category] += amount;

        if (timeframe === "weekly") {
          data.heatmapData[index] += amount;
        } else {
          const dayOfWeek = txn.date.getDay() - 1; // Use the stored date
          data.heatmapData[index][dayOfWeek] += amount;
        }
      }
    });

    // Store daily trend data with categories
    data.dailyTrends.data[index] = {
      amount: totalAmount,
      categories: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalAmount) * 100,
      })),
    };
  });

  return data;
};
