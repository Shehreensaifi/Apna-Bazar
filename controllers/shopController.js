const Shop = require("../models/shopModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllShops = catchAsync(async (req, res, next) => {
    let condition = {};
    if (req.query.lat && req.query.lng) {
        const { lat, lng, radius = 1000 } = req.query;
        condition = {
            location: {
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: "Point",
                        coordinates: [lat, lng]
                    }
                }
            }
        };
    }

    const features = new APIFeatures(Shop.find(condition), req.query)
        .filter(["radius", "lat", "lng"])
        .sort()
        .limitFields()
        .paginate();

    // console.log(features.query._conditions);
    const shops = await features.query;
    res.status(200).json({
        status: "success",
        results: shops.length,
        data: {
            shops
        }
    });
});

exports.getShop = catchAsync(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
        return next(new AppError("No document found with this ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            shop
        }
    });
});

exports.createShop = catchAsync(async (req, res, next) => {
    if (!req.body.name || !req.body.image || !req.body.location) {
        return next(
            new AppError("Shop name or price or image is not provided.", 404)
        );
    }

    //Checking if seller already have a shop
    let shop = await Shop.findOne({
        seller: req.user._id
    });

    if (shop) {
        return next(new AppError("One seller can have only one shop"));
    }

    try {
        shop = await Shop.create({
            name: req.body.name,
            image: req.body.image,
            seller: req.user._id,
            location: req.body.location
        });

        res.status(201).json({
            status: "success",
            data: {
                shop
            }
        });
    } catch (error) {
        return next(error);
    }
});

exports.updateShop = catchAsync(async (req, res, next) => {
    //find and update shop with provided id
    const shop = await Shop.findOne({
        _id: req.params.id,
        seller: req.user._id
    });

    if (!shop) {
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );
    }

    const updatedShop = await Shop.findOneAndUpdate(
        {
            _id: req.params.id,
            seller: req.user._id
        },
        {
            name: req.body.name,
            image: req.body.image,
            location: req.body.location
        },
        {
            new: true,
            omitUndefined: true
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            updatedShop
        }
    });
});

exports.deleteShop = catchAsync(async (req, res, next) => {
    //find and delete product
    const shop = await Shop.findOne({
        _id: req.params.id,
        seller: req.user._id
    });

    if (!shop) {
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );
    }

    await shop.deleteOne();

    res.status(204).json({
        status: "success",
        data: null
    });
});
