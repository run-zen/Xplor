import mongoose from "mongoose";
import Tour from "../models/tourModel.js";

const reviewSchema = new mongoose.Schema({
    review: {
        type: "String",
        required: [true, "A review must have the review text"],
    },
    rating: {
        type: Number,
        max: [5.0, "Rating cannot be greater than 5"],
        min: [0.0, "Rating cannot be less than 0"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A review must have a creator user"],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "A review must be related to a tour"],
    },
});

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: "tour",
    //     select: "name",
    // }).populate({
    //     path: "user",
    //     select: "name",
    // });
    this.populate({
        path: "user",
        select: "name",
    });

    next();
});

reviewSchema.statics.calcAvergeRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId,
            },
        },
        {
            $group: {
                _id: "$tour",
                nRating: {
                    $sum: 1,
                },
                avgRating: {
                    $avg: "$rating",
                },
            },
        },
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post("save", function (doc, next) {
    this.constructor.calcAvergeRatings(doc.tour);

    next();
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function (doc, next) {
    await this.r.constructor.calcAvergeRatings(this.r.tour);

    next();
});

const Review = new mongoose.model("Review", reviewSchema);

export default Review;
