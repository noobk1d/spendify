const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssclean = require("xss-clean");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const authRoute = require("./src/routes/authRoute");
const errorController = require("./src/controllers/errorController");

const app = express();

app.use(cors()); // ✅ Allow all origins (for testing)
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

//ROUTE
app.use("/spendify/api/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server)`, 404));
});

app.use(errorController);

module.exports = app;
