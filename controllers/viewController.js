import Tour from '../models/tourModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export const getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection

    const tours = await Tour.find();

    // 2) Build template

    // 3) render that template using the tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

export const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('No tour with that name', 404));
    }

    res.status(200)
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: *;script-src-attr 'self' *;style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour,
        });
});

export const getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
});

export const getSignupForm = catchAsync(async (req, res, next) => {
    res.status(200).render('signUp', {
        title: 'Create new account',
    });
});

export const resendConfirmationEmail = catchAsync(async (req, res, next) => {
    res.status(200).render('resendEmail', {
        title: 'Resend Confirmation Email',
    });
});

export const confirmEmail = catchAsync(async (req, res, next) => {
    res.status(200).render('confirmEmail', {
        title: 'Confirm Email',
        token: req.params.token,
    });
});

export const getMe = catchAsync(async (req, res, next) => {
    res.status(200).render('account', {
        title: 'Your Account Settings',
    });
});
