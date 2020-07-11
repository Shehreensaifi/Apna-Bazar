const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const mutlerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not a image! Please upload a image!", 400));
    }
};

const upload = multer({ storage: multerStorage, fileFilter: mutlerFilter });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadProductPhoto = upload.single("image");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const buffer = await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({
            quality: 100
        })
        .toBuffer();
    //Overwriting req.file.buffer with new modified image
    req.file.buffer = buffer;
    next();
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

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
    if (!req.body.name || !req.body.price || !req.file) {
        return next(
            new AppError("Product name or price or image is not provided.", 404)
        );
    }

    cloudinary.uploader
        .upload_stream(async (err, result) => {
            if (err) {
                console.log(err);
                next(new AppError("Error uploading image!", 500));
                return;
            }

            // add cloudinary url for the image to the body object
            req.body.image = result.secure_url;
            // add image's public_id to body object
            req.body.imageId = result.public_id;

            try {
                const product = await Product.create({
                    name: req.body.name,
                    price: req.body.price,
                    seller: req.user._id,
                    image: req.body.image,
                    imageId: req.body.imageId
                });

                res.status(201).json({
                    status: "success",
                    data: {
                        product
                    }
                });
            } catch (error) {
                return next(error);
            }
        })
        .end(req.file.buffer);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    //find and update product belonging to the current user
    const product = await Product.findOne({
        _id: req.params.id,
        seller: req.user._id
    });

    if (!product) {
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );
    }

    //Updating along with image
    if (req.file) {
        cloudinary.uploader
            .upload_stream(async (err, result) => {
                if (err) {
                    console.log(err);
                    return next(new AppError("Error uploading image!", 500));
                }

                // add cloudinary url for the image to the body object
                req.body.image = result.secure_url;
                // add image's public_id to body object
                req.body.imageId = result.public_id;

                try {
                    //deleting existing image
                    await cloudinary.uploader.destroy(product.imageId);

                    const updatedProduct = await Product.findOneAndUpdate(
                        {
                            _id: req.params.id,
                            seller: req.user._id
                        },
                        {
                            name: req.body.name,
                            price: req.body.price,
                            image: req.body.image,
                            imageId: req.body.imageId
                        },
                        {
                            new: true,
                            omitUndefined: true
                        }
                    );

                    res.status(200).json({
                        status: "success",
                        data: {
                            product: updatedProduct
                        }
                    });
                } catch (error) {
                    return next(error);
                }
            })
            .end(req.file.buffer);
        return;
    }

    //Updating without image
    const updatedProduct = await Product.findOneAndUpdate(
        {
            _id: req.params.id,
            seller: req.user._id
        },
        {
            name: req.body.name,
            price: req.body.price
        },
        {
            new: true,
            omitUndefined: true
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            updatedProduct
        }
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    //find and delete product belonging to the current user only
    const product = await Product.findOne({
        _id: req.params.id,
        seller: req.user._id
    });

    if (!product) {
        return next(
            new AppError(
                "No document found with this ID or it doesn't belong to you",
                404
            )
        );
    }

    await cloudinary.uploader.destroy(product.imageId);
    await product.deleteOne();

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.getMyProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find(
        { seller: req.user._id },
        "-seller -__v"
    );
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products
        }
    });
});
