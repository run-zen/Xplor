import { catchAsync } from "../utils/catchAsync.js";
import Review from "../models/reviewsModel.js";
// import { AppError } from "../utils/appError.js";

export const getReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
        filter.tour = req.params.tourId;
    }
    const reviews = await Review.find(filter).select(["-__v", "-tour"]);
    res.status(200).json({
        status: "success",
        data: {
            reviews: reviews,
        },
    });
});

export const createReview = catchAsync(async (req, res, next) => {
    const { review, rating } = req.body;
    const tour = req.params.tourId;

    const newReview = await Review.create({
        review,
        rating,
        tour,
        user: req.user.id,
    });

    res.status(201).json({
        status: "success",
        data: {
            review: newReview,
        },
    });
});
