const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    //1. Getting token and check if its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppError(
                "Your are not logged in! Please loggin to get access.",
                401
            )
        );
    }

    //2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError("The user belonging to this token doesn't exist")
        );
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = role => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(
                new AppError(
                    "You don't have permission to perform this task!",
                    403
                )
            );
        }

        next();
    };
};
