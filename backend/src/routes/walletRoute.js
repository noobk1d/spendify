const express = require("express");
const walletController = require("../controllers/walletController");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router
  .route("/:userId")
  .get(walletController.getUserWallet)
  .post(walletController.createUserWallet)
  .put(walletController.updateUserWallet);

module.exports = router;
