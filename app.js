const path = require("path");
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const viewRouter = require("./routes/viewRoutes");
const shopRouter = require("./routes/shopRoutes");
const deliveryDetailRouter = require("./routes/deliveryDetailRoutes");

const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Serving static files
app.use(express.static(path.join(__dirname, "public")));

//Set security HTTP headers
app.use(helmet());

//Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// compress all responses
app.use(compression());

// caching disabled for every route
app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

app.get("/favicon.ico", (req, res) => res.sendStatus(204));

app.use("/", viewRouter);
app.use("/api/v1/address", deliveryDetailRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/shops", shopRouter);

//Hit for all remaining route request which doesn't match to any of the above
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
