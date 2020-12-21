const express = require("express");
const authController = require("../controllers/authController");
const deliveryDetailController = require("../controllers/deliveryDetailController");

const router = express.Router();

//only authorized users can hit these routes
router.use(authController.protect, authController.restrictTo("user"));

router
    .route("/")
    .get(deliveryDetailController.getAllDeliveryDetails)
    .post(deliveryDetailController.createDeliveryDetail);

router
    .route("/:id")
    .get(deliveryDetailController.getDeliveryDetail)
    .patch(deliveryDetailController.updateDeliveryDetail)
    .delete(deliveryDetailController.deleteDeliveryDetail);

module.exports = router;
