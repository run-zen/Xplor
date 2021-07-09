import Tour from "../models/tourModel.js";

export default class TourCtrl {
  static async getAllTours(req, res, next) {
    try {
      // BUILD QUERY
      // 1) Filtering
      const queryObj = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el) => delete queryObj[el]);
      // 2) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );

      /////    Creating Query //////////
      let query = Tour.find(JSON.parse(queryStr));

      // 3) Sorting

      if (req.query.sort) {
        const sortStr = req.query.sort.split(",").join(" ");
        query = query.sort(sortStr);
      } else {
        query = query.sort("createdAt");
      }

      // 4) Fields limiting OR Projecting
      if (req.query.fields) {
        const fieldStr = req.query.fields.split(",").join(" ");
        query = query.select(fieldStr);
      } else {
        query = query.select("-__v");
      }

      // 5) pagination

      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      if (req.query.page) {
        const numTours = await Tour.countDocuments();
        if (skip >= numTours) throw new Error("This page does not exist");
      }

      query = query.skip(skip).limit(limit);

      // EXECUTE QUERY
      const tours = await query;

      // SEND RESPONSE
      res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
          tours: tours,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error,
      });
    }
  }

  static async getTour(req, res) {
    try {
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          tour: tour,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error,
      });
    }
  }

  static async createTour(req, res) {
    try {
      const newTour = await Tour.create(req.body);
      res.status(201).json({ status: "success", data: { tour: newTour } });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  }

  static async updateTour(req, res) {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data: {
          tour: tour,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error,
      });
    }
  }

  static async deleteTour(req, res) {
    try {
      await Tour.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  }
}
