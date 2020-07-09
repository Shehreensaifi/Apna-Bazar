const express = require("express");

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");

const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
