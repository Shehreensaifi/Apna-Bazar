const express = require("express");

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

//Hit for all remaining route request which doesn't match to any of the above
app.all("*", (req, res) => {
    res.send("no such route");
});

//Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    res.status(statusCode).json({
        status,
        error: err,
        message: err.message
    });
});

module.exports = app;
