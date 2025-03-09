const dotenv = require("dotenv");
const app = require("./app");

// dotenv.config({ path: "./config.env" });
//DB CONNECTION

const port = 3000;
//SERVER START
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.error("UNHANDLED REJECTION! Shutting down...");
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.error(" UNCAUGHT EXCEPTION! Shutting down...");
  server.close(() => process.exit(1));
});
