const express = require("express");
const multer = require("multer");
const shopController = require("../controllers/shopController");
const authController = require("../controllers/authController");

const router = express.Router();
//Required to parse multipart form data and puts them in req.body
router.use(multer().array());

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
