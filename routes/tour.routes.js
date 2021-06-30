import express from "express";
import TourCtrl from "../controllers/tour.controllers.js";

const router = express.Router();

router.route("/").get(TourCtrl.getAllTours).post(TourCtrl.createTour);
router
  .route("/:id")
  .get(TourCtrl.getTour)
  .patch(TourCtrl.updateTour)
  .delete(TourCtrl.deleteTour);

export default router;