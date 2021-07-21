import Tour from "../models/tourModel.js";
import { AppError } from "../utils/appError.js";
// import { APIfeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";

export const aliasPopularTours = (req, res, next) => {
    req.query.sort = "-ratingsAverage,price";
    req.query.limit = 5;
    req.query.fields = "name,ratingsAverage,price,duration,summary,difficulty";

    next();
};
export const getAllTours = factory.getAll(Tour);

export const getTour = factory.getOne(Tour, { path: "reviews" });

export const createTour = factory.createOne(Tour);

export const updateTour = factory.updateOne(Tour);

export const deleteTour = factory.deleteOne(Tour);

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

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;

    /// latlng - 34.265215, -118.595398

    const [lat, lng] = latlng.split(",");
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng",
                400
            )
        );
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    });

    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");
    const distanceMultiplier = unit === "mi" ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        return next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng",
                400
            )
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: "distance",
                distanceMultiplier: distanceMultiplier,
                spherical: true,
            },
        },
        {
            $project: {
                name: "$name",
                distance: {
                    $round: ["$distance", 2],
                },
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        results: distances.length,
        data: {
            data: distances,
        },
    });
});
