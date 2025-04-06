const express = require("express");
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../utils/generateTokens");
const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router
  .route("/")
  .post(verifyToken, transactionController.addTransaction)
  .get(verifyToken, transactionController.getTransactions);
router.route("/:id").get(verifyToken, transactionController.getTransactionById);

module.exports = router;
