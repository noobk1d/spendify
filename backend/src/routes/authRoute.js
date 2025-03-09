const express = require("express");
const authController = require("../controllers/authController");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router.post("/signup", authController.signUp);
router.post("/login", authController.login, authController.generateJWT);

module.exports = router;
