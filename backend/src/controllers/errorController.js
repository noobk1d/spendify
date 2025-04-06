const AppError = require("../utils/appError");

// Authentication Errors
const handleSignupError = (err) => {
  const message = `A user with the same email already exists.`;
  return new AppError(message, err.statusCode);
};

const handleLoginError = (err) => {
  const message = `Invalid email or password.`;
  return new AppError(message, 401);
};

// Transaction Errors
const handleTransactionError = (err) => {
  let message;
  if (err.message.includes("insufficient funds")) {
    message = "Insufficient funds for this transaction.";
  } else if (err.message.includes("invalid amount")) {
    message = "Invalid transaction amount.";
  } else {
    message = "Error processing transaction.";
  }
  return new AppError(message, err.statusCode || 400);
};

// Category Errors
const handleCategoryError = (err) => {
  let message;
  if (err.message.includes("duplicate")) {
    message = "A category with this name already exists.";
  } else if (err.message.includes("not found")) {
    message = "Category not found.";
  } else {
    message = "Error processing category operation.";
  }
  return new AppError(message, err.statusCode || 400);
};

// Budget Errors
const handleBudgetError = (err) => {
  let message;
  if (err.message.includes("duplicate")) {
    message = "A budget for this category already exists.";
  } else if (err.message.includes("not found")) {
    message = "Budget not found.";
  } else {
    message = "Error processing budget operation.";
  }
  return new AppError(message, err.statusCode || 400);
};

// Report/Analytics Errors
const handleReportError = (err) => {
  let message;
  if (err.message.includes("date")) {
    message = "Invalid date format or range provided.";
  } else if (err.message.includes("not found")) {
    message = "No data found for the specified period.";
  } else {
    message = "Error generating report.";
  }
  return new AppError(message, err.statusCode || 400);
};

// Validation Errors
const handleValidationError = (err) => {
  const message = `Invalid input data. ${err.message}`;
  return new AppError(message, 400);
};

// Token Errors
const handleTokenError = (err) => {
  let message;
  if (err.name === "TokenExpiredError") {
    message = "Your session has expired. Please log in again.";
  } else if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
  } else {
    message = "Authentication error. Please log in again.";
  }
  return new AppError(message, 401);
};

const sendError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (error.message.includes("duplicate key")) error = handleSignupError(error);
  if (error.message.includes("invalid credentials"))
    error = handleLoginError(error);
  if (error.message.includes("transaction"))
    error = handleTransactionError(error);
  if (error.message.includes("category")) error = handleCategoryError(error);
  if (error.message.includes("budget")) error = handleBudgetError(error);
  if (error.message.includes("report") || error.message.includes("analytics"))
    error = handleReportError(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
    error = handleTokenError(error);

  sendError(error, res);
};
