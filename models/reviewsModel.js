import mongoose from "mongoose";

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

const Review = new mongoose.model("Review", reviewSchema);

export default Review;
