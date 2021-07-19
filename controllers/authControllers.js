import { promisify } from "util";
import User from "./../models/userModel.js";
import { AppError } from "./../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }
    let currentUser = {
        role: user.role,
        name: user.name,
        email: user.email,
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: currentUser,
        },
    });
};

export const signup = catchAsync(async (req, res, next) => {
    let role = undefined;
    if (req.body.role !== "admin") {
        role = req.body.role;
    }
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: role,
    });

    req.user = newUser;

    let currentUser = {
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
    };

    res.status(201).json({
        status: "success",
        message:
            "Please confirm your email using the link that will be send to your email in a few minutes.",
        data: {
            user: currentUser,
        },
    });

    next();
});

export const sendConfirmationEmail = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return;
    }

    const confirmToken = user.createEmailConfirmToken();
    await user.save({ validateBeforeSave: false });

    // sending confirmation email to the user
    const confirmUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/confirmemail/${confirmToken}`;

    const message = `Please click or paste the link on the browser to confirm email.\n
    ${confirmUrl}`;

    if (!req.user) {
        res.status(200).json({
            status: "success",
            message:
                "Confirmation token will be send to your Email address in a few minutes",
        });
    }

    await sendEmail({
        email: user.email,
        subject: "Xplor: Email confirmation.",
        message: message,
    });
});

export const confirmEmail = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        emailConfirmToken: hashedToken,
    });

    if (!user) {
        return next(new AppError("Token is invalid or expired", 400));
    }

    user.emailConfirmToken = undefined;
    user.emailConfirmed = true;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "success",
        message: "Email confirmed. Now you can log in to your account",
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exists
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // 2) check if user exists and the password is correct
    const user = await User.findOne({ email: email }).select([
        "+password",
        "+emailConfirmed",
    ]);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Invalid email or password", 401));
    }

    if (!user.emailConfirmed) {
        return next(
            new AppError(
                "Email not confirmed, try to log in after confirming email.",
                401
            )
        );
    }

    // 3) if everything is ok, then send JWT token to the client
    createAndSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Get the JWT token and check if it exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in!. Please login to get access",
                401
            )
        );
    }
    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to the token does no longer exist",
                401
            )
        );
    }

    // 4) check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                "User recently changed password.Please log in again",
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles) => {
    function authorize(req, res, next) {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            );
        }

        next();
    }
    return authorize;
};

export const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new AppError("There is no user with that email address", 404)
        );
    }
    // 2) generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send it to user email
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/resetpassword/${resetToken}`;

    const message = `Forgot your password?\nSubmit a PATCH request with your new password and confirmPassword to : 
    ${resetUrl}.\nIf you didn't forget your password, please ignore this email!.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for only 10 mins)",
            message: message,
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to email",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                "There was an error sending email to the user. Try again later!",
                500
            )
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) if token has not expired and, there is a user, set the new password

    if (!user) {
        return next(new AppError("Token is Invalid or expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 3) update the passwordChangedAt property
    // auto updated passwordChangedAt property by mongoose middleware
    // defined in the User Model
    await user.save();

    // 4) Log the user in, send JWT

    createAndSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from  collection

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        return next(
            new AppError(
                "Something went wrong and password not updated. Please try again",
                500
            )
        );
    }
    const { password, newPassword, newPasswordConfirm } = req.body;

    // 2) Check if POSTED password is correct

    if (!(await user.correctPassword(password, user.password))) {
        return next(new AppError("Entered incorrent current password", 401));
    }
    // 3) If so, update password

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();
    // 4) Log in user

    createAndSendToken(user, 200, res);
});
