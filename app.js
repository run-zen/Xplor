///////// imports ////////////
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import TourRouter from "./routes/tour.routes.js";
import UserRouter from "./routes/user.routes.js";
import { AppError } from "./utils/appError.js";
import { globalErrorCtrl } from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN.....");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

///////// end imports //////////

const app = express();

//// 1)GLOBAL middlewares ////////
app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP.Please try again later!",
});
// rate limiter
app.use("/api", limiter);

// body parser , reading data from body to req.body
app.use(express.json({ limit: "10kb" }));

// DATA SANITIZATION AGAINST NOSQL INJECTION
app.use(mongoSanitize());

// HTTP parameter pollution
app.use(
    hpp({
        whitelist: ["duration", "ratingsAverage", "price", "difficulty"],
    })
);

// DATA SANITIZATION AGAINST CROSS SITE SCRIPTING
app.use(xss());

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();

    next();
});

////// Routers ////////

app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", UserRouter);

////////////// FallBack Route ////////////////

app.use("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorCtrl);

export { app };
