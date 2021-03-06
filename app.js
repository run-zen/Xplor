///////// imports ////////////
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import TourRouter from './routes/tour.routes.js';
import UserRouter from './routes/user.routes.js';
import ReviewRouter from './routes/review.routes.js';
import ViewRouter from './routes/view.routes.js';
import { AppError } from './utils/appError.js';
import { globalErrorCtrl } from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import cookieParser from 'cookie-parser';

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN.....');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

///////// end imports //////////

const app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve('views'));

// static files
app.use(express.static(path.resolve('public')));

//// 1)GLOBAL middlewares ////////
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                'default-src': [
                    "'self'",
                    'https://*.mapbox.com',
                    'https://fonts.googleapis.com',
                    'https://*.amazonaws.com',
                    'data:*',
                ],
                'script-src': ['https://*.mapbox.com', "'self'", 'blob:', '*'],
                'script-src-attr': ["'self'", '*'],
                'object-src': ["'none'"],
                'base-uri': ["'self'"],
                'style-src': ["'self'", 'https:', "'unsafe-inline'"],
                'font-src': ["'self'", 'https://*', 'data:'],
                'img-src': ["'self'", 'data:', 'https://*.amazonaws.com'],
                'frame-ancestors': ["'self'"],
            },
        },
    })
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP.Please try again later!',
});
// rate limiter
app.use('/api', limiter);

// body parser , reading data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// DATA SANITIZATION AGAINST NOSQL INJECTION
app.use(mongoSanitize());

// HTTP parameter pollution
app.use(
    hpp({
        whitelist: ['duration', 'ratingsAverage', 'price', 'difficulty'],
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
app.use('/', ViewRouter);
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', ReviewRouter);

////////////// FallBack Route ////////////////

app.use('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorCtrl);

export { app };
