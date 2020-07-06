const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router
    .route("/")
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.isSeller,
        productController.createProduct
    );

router.use(authController.protect, authController.isSeller);

router
    .route("/:id")
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
