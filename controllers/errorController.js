const AppError = require("../utils/appError");

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value:${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleJWTExpiredError = () =>
    new AppError("Your token has expired! Please loggin again", 401);

const handleJWTError = () =>
    new AppError("Invalid token! Please loggin again", 401);

const sendErrorProd = (err, req, res) => {
    //A. API
    if (req.originalUrl.startsWith("/api")) {
        //A. OPERATIONAL, trusted error:send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        //B. Programming or other unknown error:don't leak error details
        //1. Log the error
        console.log("ERROR:💣", err);
        //2. Send generic error
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        });
    }

    //B. RENDERED WEBSITE
    ////A. OPERATIONAL, trusted error:send message to client
    if (err.isOperational) {
        return res
            .status(err.statusCode)
            .render("error", { error: err.message });
    }
    //B. Programming or other unknown error:don't leak error details
    ////1. Log the error
    console.log("ERROR:💣", err);
    ////2. Send generic error
    return res.status(err.statusCode).render("error", {
        error: "Something went wrong...\ntry again later!"
    });
};

const sendErrorDev = (err, req, res) => {
    //A.API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    //B.RENDERED WEBSITE
    console.log("ERROR:", err);
    res.status(err.statusCode).render("error", { error: err.message });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") sendErrorDev(err, req, res);
    else if (process.env.NODE_ENV === "production") {
        if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);
        if (err.name === "JsonWebTokenError") err = handleJWTError(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === "ValidationError") err = handleValidationErrorDB(err);
        sendErrorProd(err, req, res);
    }
};
