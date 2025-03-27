const express = require("express");
const transactionController = require("../controllers/transactionController");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router.route("/:userId").post(transactionController.addTransaction);
router.route("/:userId").get(transactionController.getTransactions);
router.route("/:id").get(transactionController.getTransactionById);

module.exports = router;
