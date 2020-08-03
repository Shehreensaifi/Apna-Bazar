const axios = require("axios");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHomePage = catchAsync(async (req, res, next) => {
    if (req.user && req.user.role === "seller")
        return res.redirect("/products");

    const products = await Product.find();
    res.status(200).render("products/index", { products });
});

exports.getProductDetails = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError("No Product Found!", 404));

    res.status(200).render("products/show", { product });
});

exports.login = (req, res) => {
    res.status(200).render("login");
};

exports.signup = (req, res) => {
    res.status(200).render("signup");
};

exports.getOrders = catchAsync(async (req, res, next) => {
    //FOR USER ORDERS
    if (req.user.role === "user") {
        const response = await axios({
            method: "GET",
            url: `${req.protocol}://${req.headers.host}/api/v1/orders`,
            headers: {
                cookie: `jwt=${req.cookies.jwt}`
            }
        });
        if (response.data.status === "success")
            return res
                .status(200)
                .render("orders/index", { orders: response.data.data.orders });
        return next(
            new AppError("Something went wrong. Please try again later", 500)
        );
    }

    //FOR SELLER ORDERS
    const response = await axios({
        method: "GET",
        url: `${req.protocol}://${req.headers.host}/api/v1/orders/seller`,
        headers: {
            cookie: `jwt=${req.cookies.jwt}`
        }
    });
    if (response.data.status === "success")
        return res
            .status(200)
            .render("orders/index", { orders: response.data.data.orders });
    return next(
        new AppError("Something went wrong. Please try again later", 500)
    );
});

//Seller's all products page
exports.getAllProductsPage = catchAsync(async (req, res, next) => {
    const products = await Product.find(
        { seller: req.user._id },
        "-seller -__v"
    );
    res.status(200).render("products/seller/index", { products });
});

exports.getNewProductPage = (req, res, next) => {
    res.status(200).render("products/seller/new");
};
