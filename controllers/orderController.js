const catchAsync = require("../utils/catchAsync");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const DeliveryDetail = require("../models/deliveryDetailModel");
const AppError = require("../utils/appError");

///////////////////////////////////////////////////////////
///////////USER ORDERS CONTROLLERS/////////////////////////
///////////////////////////////////////////////////////////
exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id,
        status: { $nin: ["removed"] }
    }).sort("-createdAt");

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.createOrder = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.body.product);
    if (!product) {
        return next(new AppError("No document belong to this ID", 404));
    }

    const address = await DeliveryDetail.findOne({
        _id: req.body.address,
        user: req.user._id
    });
    if (!address) {
        return next(new AppError("No document belong to this ID", 404));
    }

    const order = await Order.create({
        user: req.user._id,
        product,
        address,
        quantity: req.body.quantity
    });

    res.status(201).json({
        status: "success",
        data: {
            order
        }
    });
});

exports.cancelOrRemoveOrder = catchAsync(async (req, res, next) => {
    const notAllowed = ["pending", "confirmed", "delivered"];
    if (!req.body.status || notAllowed.includes(req.body.status)) {
        return next(new AppError("Invalid request", 400));
    }
    const order = await Order.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user._id
        },
        {
            status: req.body.status
        },
        { new: true, runValidators: true }
    );
    if (!order) {
        return next(
            new AppError(
                "Document with this ID doesn't exist or this document doesn't belong to this user"
            )
        );
    }
    res.status(200).json({
        status: "success",
        data: {
            order
        }
    });
});

///////////////////////////////////////////////////////////
///////////SELLER ORDERS CONTROLLERS/////////////////////////
///////////////////////////////////////////////////////////

exports.getAllSellerOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ "product.seller": req.user._id }).sort(
        "-createdAt"
    );

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    if (!req.body.status || req.body.status === "removed") {
        return next(new AppError("Invalid request", 400));
    }
    const order = await Order.findOneAndUpdate(
        {
            _id: req.params.id,
            "product.seller": req.user._id,
            status: { $nin: ["cancelled", "removed", "delivered"] }
        },
        { status: req.body.status },
        {
            new: true,
            runValidators: true
        }
    );
    if (!order) {
        return next(
            new AppError(
                "No document exists with that Id or this document doesn't belong to this seller",
                404
            )
        );
    }
    res.status(200).json({
        status: "success",
        data: {
            order
        }
    });
});
