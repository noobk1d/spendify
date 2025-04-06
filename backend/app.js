const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssclean = require("xss-clean");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const authRoute = require("./src/routes/authRoute");
const profileRoute = require("./src/routes/profileRoute");
const walletRoute = require("./src/routes/walletRoute");
const transactionRoute = require("./src/routes/transactionRoute");
const categoriesRoute = require("./src/routes/categoriesRoute");
const recurringRoute = require("./src/routes/recurringRoutes");
const budgetRoute = require("./src/routes/budgetRoute");
const reportRoute = require("./src/routes/reportRoute");
const dashboardRoute = require("./src/routes/dashboardRoute");
const billRoute = require("./src/routes/billsRoute");

const errorController = require("./src/controllers/errorController");

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());

app.use(helmet());
app.use(express.json({ limit: "10kB" }));

//Data Sanitization againt NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization againt XSS
app.use(xssclean());

//3rd pary Middleware
app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP,please try again later in an hour!",
});
app.use("/api", limiter);

// Add request logging middleware

//ROUTE

app.use("/spendify/api/auth", authRoute);
app.use("/spendify/api/profile", profileRoute);
app.use("/spendify/api/wallet", walletRoute);
app.use("/spendify/api/transaction", transactionRoute);
app.use("/spendify/api/categories", categoriesRoute);
app.use("/spendify/api/recurring", recurringRoute);
app.use("/spendify/api/budget", budgetRoute);
app.use("/spendify/api/reports", reportRoute);
app.use("/spendify/api/dashboard", dashboardRoute);
app.use("/spendify/api/bills", billRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server)`, 404));
});

app.use(errorController);

module.exports = app;
