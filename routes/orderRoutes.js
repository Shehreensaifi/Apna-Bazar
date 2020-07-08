const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

///////////////////////////////////////////////////////
///////////USER ORDERS ROUTES/////////////////////////
///////////////////////////////////////////////////////

router
    .route("/")
    .get(authController.restrictTo("user"), orderController.getAllOrders)
    .post(authController.restrictTo("user"), orderController.createOrder);

router
    .route("/:id")
    .patch(
        authController.restrictTo("user"),
        orderController.cancelOrRemoveOrder
    );

///////////////////////////////////////////////////////
///////////SELLER ORDERS ROUTES/////////////////////////
///////////////////////////////////////////////////////

router
    .route("/seller")
    .get(
        authController.restrictTo("seller"),
        orderController.getAllSellerOrders
    );

router
    .route("/seller/:id")
    .patch(
        authController.restrictTo("seller"),
        orderController.updateOrderStatus
    );

module.exports = router;
