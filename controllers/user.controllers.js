import { readFileSync } from "fs";
import path from "path";

// const __dirname = path.resolve();
// let tours = JSON.parse(
//   readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

export default class UserCtrl {
  static getAllUsers(req, res) {
    res.status(500).json({
      status: "success",
      message: "Route not yet defined",
    });
  }
  static createUser(req, res) {
    res.status(500).json({
      status: "success",
      message: "Route not yet defined",
    });
  }
  static updateUser(req, res) {
    res.status(500).json({
      status: "success",
      message: "Route not yet defined",
    });
  }
  static getUser(req, res) {
    res.status(500).json({
      status: "success",
      message: "Route not yet defined",
    });
  }
  static deleteUser(req, res) {
    res.status(500).json({
      status: "success",
      message: "Route not yet defined",
    });
  }
}
