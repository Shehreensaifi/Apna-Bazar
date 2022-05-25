const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION... Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE_REMOTE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("DB connection successful"))
    .catch(error => {
        console.log("ERROR MESSAGE ");
        console.log(error);
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("Server started");
});

process.on("unhandledRejection", err => {
    console.log("UNHANDLED REJECTION... Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully..");
    server.close(() => {
        console.log("💣Process terminated");
    });
});
