const cron = require("node-cron");
const {
  processRecurringTransactions,
} = require("../services/recurringService");

// (async () => {
//   console.log("⏳ Running recurring transactions manually...");
//   await processRecurringTransactions();
//   console.log("✅ Recurring transactions processed!");
// })();

// cron.schedule(
//   "22 11 * * *",
//   async () => {
//     try {
//       console.log(
//         "⏳ Running scheduled job to process recurring transactions..."
//       );

//       // Process transactions due for execution today
//       await processRecurringTransactions();

//       console.log("✅ Recurring transactions processed successfully.");
//     } catch (error) {
//       console.error("❌ Error processing recurring transactions:", error);
//     }
//   },
//   {
//     timezone: "Asia/Kolkata",
//   }
// );

cron.schedule(
  "29 18 * * *",
  async () => {
    try {
      console.log("⏳ Cron job triggered for recurring transactions...");
      await processRecurringTransactions();
      console.log("✅ Recurring transactions processed!");
    } catch (error) {
      console.error("❌ Error processing recurring transactions:", error);
      throw new AppError(
        `❌ Error processing recurring transactions:"${error}`,
        400
      );
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set explicitly to IST
    immediate: true,
  }
);
