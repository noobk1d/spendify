const express = require("express");
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../utils/generateTokens");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router
  .route("")
  .get(verifyToken, walletController.getUserWallet)
  .post(verifyToken, walletController.createUserWallet)
  .put(verifyToken, walletController.updateUserWallet);

module.exports = router;
