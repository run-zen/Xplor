import { AppError } from "../utils/appError.js";

const handleCastErrDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
    const message = `Duplicate field value: \"${err.keyValue.name}\". Please use another value`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(item => item.message);

    const message = `Invalid inputs: ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const sendErroDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        err: err
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error(`Error `, err);
        res.status(500).json({
            status: "error",
            err: "something went wrong"
        });
    }
};

export const globalErrorCtrl = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErroDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.name = err.name;
        if (error.name === "CastError") {
            error = handleCastErrDB(error);
        }
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);

        sendErrorProd(error, res);
    }
};
