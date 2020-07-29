const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHomePage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render("home", { products });
});

exports.getProductDetails = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError("No Product Found!", 404));

    res.status(200).render("product", { product });
});

exports.login = catchAsync(async (req, res, next) => {
    res.status(200).render("login");
});

exports.signup = catchAsync(async (req, res, next) => {
    res.status(200).render("signup");
});

exports.getOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id,
        status: { $nin: ["removed"] }
    }).sort("-createdAt");

    res.status(200).render("order", { orders });
});
