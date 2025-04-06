const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");
const AppError = require("../utils/appError");
const { generateToken } = require("../utils/generateTokens");

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const phone = "+12345678";

  // ✅ 1. Validate confirm password
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match!", 400));
  }
  const phoneRegex = /^\+\d{7,15}$/; // Ensure it starts with + and has 7-15 digits
  if (!phoneRegex.test(phone)) {
    return next(new AppError("Invalid phone number format!", 400));
  }
  const user = await authService.createUser(name, email, phone, password);

  // Generate JWT token
  const token = generateToken(user.userId);

  res.status(201).json({
    status: "success",
    message: "User registered successfully!",
    data: {
      email: user.email,
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError("Email and password are required!", 400));
  }
  const session = await authService.loginUser(email, password);

  // Generate JWT token
  const token = generateToken(session.userId);

  res.status(200).json({
    message: "User Logged in successfully!",
    data: {
      status: "success",
      email: session.email,
      token,
    },
  });
});
