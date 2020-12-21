const DeliveryDetail = require("../models/deliveryDetailModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllDeliveryDetails = catchAsync(async (req, res, next) => {
    const deliveryDetails = await DeliveryDetail.find({ user: req.user._id });

    res.status(200).json({
        status: "success",
        results: deliveryDetails.length,
        data: {
            deliveryDetails
        }
    });
});

exports.getDeliveryDetail = catchAsync(async (req, res, next) => {
    const deliveryDetail = await DeliveryDetail.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!deliveryDetail)
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );

    res.status(200).json({
        data: {
            deliveryDetail
        }
    });
});

exports.createDeliveryDetail = catchAsync(async (req, res, next) => {
    const deliveryDetail = await DeliveryDetail.create({
        user: req.user._id,
        address: req.body.address,
        phone: req.body.phone
    });

    res.status(201).json({
        status: "success",
        data: {
            deliveryDetail
        }
    });
});

exports.updateDeliveryDetail = catchAsync(async (req, res, next) => {
    const deliveryDetail = await DeliveryDetail.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!deliveryDetail)
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );

    const updatedDeliveryDetail = await DeliveryDetail.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user._id
        },
        {
            phone: req.body.phone,
            address: req.body.address
        },
        {
            omitUndefined: true,
            new: true
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            deliveryDetail: updatedDeliveryDetail
        }
    });
});

exports.deleteDeliveryDetail = catchAsync(async (req, res, next) => {
    const deliveryDetail = await DeliveryDetail.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!deliveryDetail)
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );

    await deliveryDetail.deleteOne();

    res.status(204).json({
        status: "success",
        data: null
    });
});
