import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    });
});
export const createUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined"
    });
});
export const updateUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined"
    });
});
export const getUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined"
    });
});
export const deleteUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: "success",
        message: "Route not yet defined"
    });
});
