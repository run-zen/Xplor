import Tour from "../models/tourModel.js";

export default class TourCtrl {
  static async getAllTours(req, res, next) {
    try {
      const tours = await Tour.find();
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
