import { AppError } from '../utils/appError.js';

const handleCastErrDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    const message = `Duplicate field value: \"${err.keyValue.name}\". Please use another value`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((item) => item.message);

    const message = `Invalid inputs: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please login again', 401);

const sendErroDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            err: err,
        });
    }
    console.error(`Error `, err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        console.error(`Error `, err);
        return res.status(err.statusCode).json({
            status: 'error',
            err: 'something went wrong',
        });
    }
    // Rendered website

    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message,
        });
    }
    console.error(`Error `, err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later',
    });
};

export const globalErrorCtrl = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErroDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.name = err.name;
        error.message = err.message;
        if (error.name === 'CastError') {
            error = handleCastErrDB(error);
        }
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError(error);
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }

        sendErrorProd(error, req, res);
    }
};
