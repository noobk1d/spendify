const express = require("express");
const profileController = require("../controllers/profileController");
const { verifyToken } = require("../utils/generateTokens");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router
  .route("/me")
  .get(verifyToken, profileController.getMe)
  .put(verifyToken, profileController.updateMe);

module.exports = router;
