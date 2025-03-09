const AppError = require("../utils/appError");

const handleSignupError = (err) => {
  message = `A user with the same email already exists.`;
  return new AppError(message, err.statusCode);
};
const sendError = (err, res) => {
  console.log(1);
  //Operational
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong!!",
      error: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = err;
  console.log(error.message);
  if (
    error.message ===
    "A user with the same id, email, or phone already exists in this project."
  )
    error = handleSignupError(error);
  sendError(error, res);
};
