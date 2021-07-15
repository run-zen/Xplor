import express from "express";
import * as TourCtrl from "../controllers/tour.controllers.js";

const router = express.Router();

router.route("/popular").get(TourCtrl.aliasPopularTours, TourCtrl.getAllTours);

router.route("/tour-stats").get(TourCtrl.getTourStats);
router.route("/monthlyplan/:year").get(TourCtrl.getMonthlyStats);

router
    .route("/")
    .get(TourCtrl.getAllTours)
    .post(TourCtrl.createTour);
router
    .route("/:id")
    .get(TourCtrl.getTour)
    .patch(TourCtrl.updateTour)
    .delete(TourCtrl.deleteTour);

export default router;
