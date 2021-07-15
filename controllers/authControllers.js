import User from "./../models/userModel.js";
import { AppError } from "./../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser,
        },
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exists
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // 2) check if user exists and the password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Invalid email or password", 401));
    }

    // 3) if everything is ok, then send JWT token to the client
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
    });
});
