import { readFileSync } from "fs";
import path from "path";

const __dirname = path.resolve();
let tours = JSON.parse(
  readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
export default class TourCtrl {
  static getAllTours(req, res, next) {
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours: tours,
      },
    });
    res.end();
  }

  static getTour(req, res) {
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
    if (!tour) {
      return res.status(404).json({
        status: "tour not found",
        message: `No tour with id : ${id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
    res.end();
  }

  static createTour(req, res) {
    const newId = tours.length;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.unshift(newTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      () => {
        res.status(201).json({ status: "success", data: { tour: newTour } });
      }
    );
  }

  static updateTour(req, res) {
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
    if (!tour) {
      return res.status(404).json({
        status: "tour not found",
        message: `No tour with id : ${id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        tour: "Upadated tour ...",
      },
    });
    res.end();
  }

  static deleteTour(req, res) {
    const id = req.params.id * 1;
    const index = tours.findIndex((tour) => tour.id === id);
    if (index === -1) {
      return res.status(404).json({
        status: "tour not found",
        message: `No tour with id : ${id}`,
      });
    } else {
      const deletedTour = tours[index];
      tours.splice(index, 1);
      res.status(200).json({
        status: "success",
        data: {
          "deleted tour": deletedTour,
        },
      });
    }
    res.end();
  }
}
