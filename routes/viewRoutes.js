const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getHomePage);

//Seller's all products page
router.get(
    "/products",
    authController.protect,
    authController.restrictTo("seller"),
    viewsController.getAllProductsPage
);
router.get(
    "/products/new",
    authController.protect,
    authController.restrictTo("seller"),
    viewsController.getNewProductPage
);
router.get(
    "/products/:id/edit",
    authController.protect,
    authController.restrictTo("seller"),
    viewsController.getEditProductPage
);

router.get("/orders", authController.protect, viewsController.getOrders);
router.get(
    "/orders/:id",
    authController.protect,
    viewsController.getOrderDetails
);

router.get("/login", authController.isLoggedIn, viewsController.login);
router.get("/signup", authController.isLoggedIn, viewsController.signup);

// Address
router.get(
    "/:productId/address",
    authController.protect,
    authController.restrictTo("user"),
    viewsController.getAllAddresses
);
router.get(
    "/:productId/address/new",
    authController.protect,
    authController.restrictTo("user"),
    viewsController.getNewAddressPage
);
router.get(
    "/:productId/address/:id/edit",
    authController.protect,
    authController.restrictTo("user"),
    viewsController.getEditAddressPage
);

router.get(
    "/:productId/address/:id/checkout",
    authController.protect,
    authController.restrictTo("user"),
    viewsController.getCheckoutPage
);

//Get Product detail
router.get(
    "/:id",
    authController.protect,
    authController.restrictTo("user"),
    viewsController.getProductDetails
);

module.exports = router;
