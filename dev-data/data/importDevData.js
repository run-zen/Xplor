import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from './../../models/tourModel.js';
import User from './../../models/userModel.js';
import Review from './../../models/reviewsModel.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!......'));

// Read JSON file

const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`./dev-data/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`./dev-data/data/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });

        console.log('Data successfully loaded');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();

        console.log('Data deleted successfully!....');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
