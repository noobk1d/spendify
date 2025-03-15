const express = require("express");
const categoriesController = require("../controllers/categoriesController");

const app = express();
//Middleware
app.use(express.json());

const router = express.Router();

//Auth
router.get("/:userId", categoriesController.getCategories);
router
  .route("/:userId")
  .post(categoriesController.addCategory)
  .delete(categoriesController.deleteCategory);

module.exports = router;
