import multer from 'multer';
import aws from 'aws-sdk';
import sharp from 'sharp';
import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import * as factory from './handlerFactory.js';

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

// const s3 = new aws.S3();

// const uploadS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'xplor',
//         acl: 'public-read',
//         shouldTransform: function (req, file, cb) {
//             cb(null, /^image/i.test(file.mimetype));
//         },
//         transforms: [
//             {
//                 id: 'photo',
//                 key: function (req, file, cb) {
//                     cb(null, `img/users/user-${req.user.id}-${Date.now()}.jpeg`);
//                 },
//                 transform: function (req, file, cb) {
//                     cb(
//                         null,
//                         sharp()
//                             .resize(500, 500)
//                             .withMetadata()
//                             .toFormat('jpeg')
//                             .jpeg({ quality: 90 })
//                     );
//                 },
//             },
//         ],
//     }),
// });

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

export const uploadPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    // const image = req.file;

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    const { data, info } = await sharp(req.file.buffer)
        .resize(500, 500)
        .withMetadata()
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer({ resolveWithObject: true });

    let s3bucket = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.S3_USER_PATH}${req.file.filename}`,
        Body: data,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
    };

    s3bucket.upload(params, async (err, data) => {
        if (err)
            return next(new AppError('Cannot upload image.Please try again after some time', 500));

        req.file.link = data.Location;
        return next();
    });
});

export const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(`This route is not for password update. Instead use /updatepassword.`, 400)
        );
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    if (req.file) {
        filteredBody.photo = req.file.link;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

const filterObj = (user, ...allowedFields) => {
    const filteredObj = {};
    allowedFields.forEach((el) => {
        if (user[el]) {
            filteredObj[el] = user[el];
        }
    });

    return filteredObj;
};

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getAllUsers = factory.getAll(User);

export const createUser = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: 'success',
        message: 'Please use /signup to create new user',
    });
});
export const getUser = factory.getOne(User);

export const updateUser = factory.updateOne(User);

export const deleteUser = factory.deleteOne(User);
