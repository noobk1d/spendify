const walletService = require("./walletService");
const transactionService = require("./transactionService");

exports.getDashboardData = async (userId, startDate, endDate, filterType) => {
  try {
    // 🔹 Fetch total wallet balance
    const walletBalance = await walletService.getUserWallet(userId);
    // 🔹 Fetch transactions within the given time range
    let transactionFilter = { filterType };
    // console.log(transactionFilter);
    const transactions = await transactionService.getTransactions(
      userId,
      transactionFilter
    );

    // const data = transactions.documents;
    // const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    // console.log(sortedData);

    let totalIncome = 0;
    let totalExpenses = 0;
    let categoryExpenses = {};
    let incomeExpenseGraph = {}; // Daily income vs expense
    let cumulativeGraph = {}; // Cumulative income vs expense
    let runningIncome = 0;
    let runningExpense = 0;

    transactions.documents.forEach((txn) => {
      const txnDate = txn.date.split("T")[0]; // Extract YYYY-MM-DD

      // 🔹 Ensure the date exists in both graphs
      if (!incomeExpenseGraph[txnDate]) {
        incomeExpenseGraph[txnDate] = { income: 0, expense: 0 };
      }
      if (!cumulativeGraph[txnDate]) {
        cumulativeGraph[txnDate] = { income: 0, expense: 0 };
      }

      // 🔹 Update income and expense for the specific date
      if (txn.type === "income") {
        totalIncome += txn.amount;
        incomeExpenseGraph[txnDate].income += txn.amount;
        runningIncome += txn.amount; // Accumulate income
      } else if (txn.type === "expense") {
        totalExpenses += txn.amount;
        incomeExpenseGraph[txnDate].expense += txn.amount;
        runningExpense += txn.amount; // Accumulate expense

        categoryExpenses[txn.category] =
          (categoryExpenses[txn.category] || 0) + txn.amount;
      }

      // 🔹 Update cumulative graph
      cumulativeGraph[txnDate].income = runningIncome;
      cumulativeGraph[txnDate].expense = runningExpense;
    });

    // 🔹 Sort & get top 3 spending categories
    const topCategories = Object.entries(categoryExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    // 🔹 Get recent 3 transactions
    const recentTransactions = transactions.documents.slice(0, 3);

    return {
      walletBalance: walletBalance.totalBalance,
      incomeExpenseGraph,
      topSpendingCategories: topCategories,
      recentTransactions,
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard data: ${error.message}`);
  }
};
