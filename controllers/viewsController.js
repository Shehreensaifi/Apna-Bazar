const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.getHomePage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render("home-page", { products });
});
