const express = require("express");
const profileController = require("../controllers/profileController");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router
  .route("/me/:userId")
  .get(profileController.getMe)
  .put(profileController.updateMe);
// router.post("/auth/login", authController.login);

module.exports = router;
