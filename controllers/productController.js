const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query).filter().sort();
    const products = await features.query;
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products
        }
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError("No document found with this ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            product
        }
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const tour = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image
    });
    res.status(201).json({
        status: "success",
        data: {
            tour
        }
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image
        },
        {
            new: true, //Return new doc
            omitUndefined: true //removes undefined field from query object before proccessing
        }
    );
    if (!product) {
        return next(new AppError("No document found with this ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            product
        }
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new AppError("No document found with this ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null
    });
});
