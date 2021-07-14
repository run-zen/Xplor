///////// imports ////////////
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import TourRouter from "./routes/tour.routes.js";
import UserRouter from "./routes/user.routes.js";

dotenv.config({ path: "./config.env" });

///////// end imports //////////

const app = express();

//// 1)middlewares ////////

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json());

////// Routers ////////

app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", UserRouter);

////////////// FallBack Route ////////////////

app.use("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `can't find ${req.originalUrl} on this server`
    // });

    const err = new Error(`can't find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    err.status = "fail";

    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

export default app;
