import Tour from "../models/tourModel.js";
import { APIfeatures } from "../utils/apiFeatures.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const aliasPopularTours = (req, res, next) => {
    req.query.sort = "-ratingsAverage,price";
    req.query.limit = 5;
    req.query.fields = "name,ratingsAverage,price,duration,summary,difficulty";

    next();
};
export const getAllTours = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIfeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    });
});
export const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate("reviews");

    if (!tour) {
        return next(new AppError(`can't find tour with that ID`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: tour,
        },
    });
});
export const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "success",
        data: { tour: newTour },
    });
});
export const updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError(`can't find tour with that ID`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: tour,
        },
    });
});
export const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError(`can't find tour with that ID`, 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});
export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: {
                    $gte: 4.5,
                },
            },
        },
        {
            $group: {
                _id: {
                    $toUpper: "$difficulty",
                },
                numTours: {
                    $sum: 1,
                },
                avgRating: {
                    $avg: "$ratingsAverage",
                },
                numRatings: {
                    $sum: "$ratingsQuantity",
                },
                avgPrice: {
                    $avg: "$price",
                },
                minPrice: {
                    $min: "$price",
                },
                maxPrice: {
                    $max: "$price",
                },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: stats,
    });
});
export const getMonthlyStats = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const stats = await Tour.aggregate([
        {
            $unwind: {
                path: "$startDates",
            },
        },
        {
            $addFields: {
                year: {
                    $year: "$startDates",
                },
                month: {
                    $month: "$startDates",
                },
            },
        },
        {
            $match: {
                year: year,
            },
        },
        {
            $group: {
                _id: "$month",
                numTours: {
                    $sum: 1,
                },
                tours: {
                    $push: "$name",
                },
            },
        },
        {
            $addFields: {
                month: "$_id",
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                numTours: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: "success",
        data: stats,
    });
});
