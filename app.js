const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");

const globalErrorHandler = require("./controllers/errorController");

const app = express();

//Set security HTTP headers
app.use(helmet());

//Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// compress all responses
app.use(compression());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);

//Hit for all remaining route request which doesn't match to any of the above
app.all("*", (req, res) => {
    res.send("no such route");
});

//Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
