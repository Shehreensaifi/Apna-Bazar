const express = require("express");
const shopController = require("../controllers/shopController");
const authController = require("../controllers/authController");

const router = express.Router();

router
    .route("/")
    .get(shopController.getAllShops)
    .post(
        authController.protect,
        authController.restrictTo("seller"),
        shopController.createShop
    );

router
    .route("/:id")
    .get(shopController.getShop)
    .patch(
        authController.protect,
        authController.restrictTo("seller"),
        shopController.updateShop
    )
    .delete(
        authController.protect,
        authController.restrictTo("seller"),
        shopController.deleteShop
    );

module.exports = router;
