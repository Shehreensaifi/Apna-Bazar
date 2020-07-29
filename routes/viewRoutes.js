const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", viewsController.getHomePage);

router.get("/orders", authController.protect, viewsController.getOrders);
router.get("/login", viewsController.login);
router.get("/signup", viewsController.signup);
router.get("/:id", viewsController.getProductDetails);

module.exports = router;
