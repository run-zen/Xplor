import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { APIfeatures } from "../utils/apiFeatures.js";

export const deleteOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(`No document found with that ID`, 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

export const updateOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError(`No document found with that ID`, 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });

export const createOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });

export const getOne = (model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = model.findById(req.params.id);

        if (popOptions) query = query.populate(popOptions);

        const doc = await query;

        if (!doc) {
            return next(new AppError(`No document found with that ID`, 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });

export const getAll = (model) =>
    catchAsync(async (req, res, next) => {
        // filter object is for the GET review using tour id
        let filter = {};
        if (req.params.tourId) {
            filter.tour = req.params.tourId;
        }

        // EXECUTE QUERY
        const features = new APIfeatures(model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const doc = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
