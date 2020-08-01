const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getHomePage);

router.get(
    "/products",
    authController.protect,
    authController.restrictTo("seller"),
    viewsController.getAllProductsPage
);
router.get("/orders", authController.protect, viewsController.getOrders);
router.get("/login", authController.isLoggedIn, viewsController.login);
router.get("/signup", authController.isLoggedIn, viewsController.signup);
router.get(
    "/:id",
    authController.isLoggedIn,
    viewsController.getProductDetails
);

module.exports = router;
