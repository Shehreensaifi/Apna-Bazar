const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.getHomePage);

router.get("/login", viewsController.login);
router.get("/signup", viewsController.signup);
router.get("/:id", viewsController.getProductDetails);

module.exports = router;
