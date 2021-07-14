import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxlength: [
                40,
                "A tour must have less than or equal to 40 characters",
            ],
            minlength: [
                10,
                "A tour must have more than or equal to 40 characters",
            ],
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty is either : easy, medium or difficult",
            },
        },

        ratingsAverage: {
            type: Number,
            default: 4.5,
            max: [5, "Tour rating must be below 5.0"],
            min: [1, "Tour rating must be above 1.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // works only for creating new doc
                    return val <= 100;
                },
                message: "Discount price ({VALUE}) must be less than 100%",
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a description"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toOject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

///// MONGOOSE MIDDLEWARES

//// DOCUMENT MIDDLEWARE : RUNS BEFORE SAVE() AND CREATE()
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });

    next();
});

tourSchema.post("save", function (doc, next) {
    console.log(doc);
    next();
});

//// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

//// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true,
            },
        },
    });

    next();
});

const TourModel = new mongoose.model("Tour", tourSchema);

export default TourModel;
