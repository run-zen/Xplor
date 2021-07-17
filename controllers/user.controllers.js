import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import { AppError } from "../utils/appError.js";

const filterObj = (user, ...allowedFields) => {
    const filteredObj = {};
    allowedFields.forEach((el) => {
        if (user[el]) {
            filteredObj[el] = user[el];
        }
    });

    return filteredObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                `This route is not for password update. Instead use /updatepassword.`,
                400
            )
        );
    }

    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});
export const createUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined",
    });
});
export const updateUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined",
    });
});
export const getUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined",
    });
});
export const deleteUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined",
    });
});
