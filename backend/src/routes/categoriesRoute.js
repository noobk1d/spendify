const express = require("express");
const categoriesController = require("../controllers/categoriesController");
const { verifyToken } = require("../utils/generateTokens");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router.get("/", verifyToken, categoriesController.getCategories);
router
  .route("/")
  .post(verifyToken, categoriesController.addCategory)
  .delete(verifyToken, categoriesController.deleteCategory);

module.exports = router;
