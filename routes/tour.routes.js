import express from "express";
import TourCtrl from "../controllers/tour.controllers.js";

const router = express.Router();

router.param("id", TourCtrl.checkID);

router
  .route("/")
  .get(TourCtrl.getAllTours)
  .post(TourCtrl.checkBody, TourCtrl.createTour);
router
  .route("/:id")
  .get(TourCtrl.getTour)
  .patch(TourCtrl.updateTour)
  .delete(TourCtrl.deleteTour);

export default router;
