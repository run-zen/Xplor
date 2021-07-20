import express from "express";
import * as TourCtrl from "../controllers/tour.controllers.js";
import * as AuthCtrl from "../controllers/authControllers.js";
import ReviewRouter from "./review.routes.js";

const router = express.Router();

router.use("/:tourId/reviews", ReviewRouter);

router.route("/popular").get(TourCtrl.aliasPopularTours, TourCtrl.getAllTours);

router.route("/tour-stats").get(TourCtrl.getTourStats);
router.route("/monthlyplan/:year").get(TourCtrl.getMonthlyStats);

router
    .route("/")
    .get(AuthCtrl.protect, TourCtrl.getAllTours)
    .post(AuthCtrl.protect, AuthCtrl.restrictTo("admin"), TourCtrl.createTour);
router
    .route("/:id")
    .get(TourCtrl.getTour)
    .patch(TourCtrl.updateTour)
    .delete(
        AuthCtrl.protect,
        AuthCtrl.restrictTo("admin", "lead-guide"),
        TourCtrl.deleteTour
    );

export default router;
