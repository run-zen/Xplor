// import { catchAsync } from "../utils/catchAsync.js";
import Review from "../models/reviewsModel.js";
import * as factory from "./handlerFactory.js";

// import { AppError } from "../utils/appError.js";

export const getReviews = factory.getAll(Review);

export const setToursIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

export const createReview = factory.createOne(Review);

export const getReview = factory.getOne(Review);

export const updateReview = factory.updateOne(Review);

export const deleteReview = factory.deleteOne(Review);
