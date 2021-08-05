import Tour from '../models/tourModel.js';
import { AppError } from '../utils/appError.js';
// import { APIfeatures } from "../utils/apiFeatures.js";
import { catchAsync } from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import multer from 'multer';
import aws from 'aws-sdk';
import sharp from 'sharp';

export const aliasPopularTours = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = 5;
    req.query.fields = 'name,ratingsAverage,price,duration,summary,difficulty';

    next();
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        cb(new AppError('Not an image, please upload an image', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

export const uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);

export const resizeUploadTourImages = catchAsync(async (req, res, next) => {
    if (req.files.images) {
        if (req.files.images.length !== 3) {
            return next(new AppError('Please upload three tour images', 400));
        }
    }
    if (req.files.imageCover) {
        const imageCoverName = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

        let s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        try {
            const { data, info } = await sharp(req.files.imageCover[0].buffer)
                .resize(2000, 1333)
                .withMetadata()
                .toFormat('jpeg')
                .jpeg({ quality: 100 })
                .toBuffer({ resolveWithObject: true });

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${process.env.S3_TOUR_PATH}${imageCoverName}`,
                Body: data,
                ContentType: 'image/jpeg',
                ACL: 'public-read',
            };
            const resImageCover = await s3bucket.upload(params).promise();

            req.body.imageCover = resImageCover.Location;
        } catch (err) {
            return next(
                new AppError('Cannot upload Coverimage.Please try again after some time', 500)
            );
        }
    }

    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, index) => {
                const fileName = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

                const { data, info } = await sharp(file.buffer)
                    .resize(2000, 1333)
                    .withMetadata()
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toBuffer({ resolveWithObject: true });

                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `${process.env.S3_TOUR_PATH}${fileName}`,
                    Body: data,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                };

                const resImage = await s3bucket.upload(params).promise();

                // saving location of image to body for updating
                // to the database
                req.body.images.push(resImage.Location);
            })
        );
    }
    // forwading to the next middleware
    next();
});

export const getAllTours = factory.getAll(Tour);

export const getTour = factory.getOne(Tour, { path: 'reviews' });

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
                    $toUpper: '$difficulty',
                },
                numTours: {
                    $sum: 1,
                },
                avgRating: {
                    $avg: '$ratingsAverage',
                },
                numRatings: {
                    $sum: '$ratingsQuantity',
                },
                avgPrice: {
                    $avg: '$price',
                },
                minPrice: {
                    $min: '$price',
                },
                maxPrice: {
                    $max: '$price',
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
        status: 'success',
        data: stats,
    });
});
export const getMonthlyStats = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const stats = await Tour.aggregate([
        {
            $unwind: {
                path: '$startDates',
            },
        },
        {
            $addFields: {
                year: {
                    $year: '$startDates',
                },
                month: {
                    $month: '$startDates',
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
                _id: '$month',
                numTours: {
                    $sum: 1,
                },
                tours: {
                    $push: '$name',
                },
            },
        },
        {
            $addFields: {
                month: '$_id',
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
        status: 'success',
        data: stats,
    });
});

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;

    /// latlng - 34.265215, -118.595398

    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(
            new AppError('Please provide latitude and longitude in the format lat,lng', 400)
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
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');
    const distanceMultiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        return next(
            new AppError('Please provide latitude and longitude in the format lat,lng', 400)
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: distanceMultiplier,
                spherical: true,
            },
        },
        {
            $project: {
                name: '$name',
                distance: {
                    $round: ['$distance', 2],
                },
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: {
            data: distances,
        },
    });
});
