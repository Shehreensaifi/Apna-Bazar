const express = require("express");
const shopController = require("../controllers/shopController");

const router = express.Router();

router
    .route("/")
    .get(shopController.getAllShops)
    .post(shopController.createShop);

router
    .route("/:id")
    .patch(shopController.updateShop)
    .delete(shopController.deleteShop);

module.exports = router;
