import express from "express";
import * as AuthCtrl from "../controllers/authControllers.js";
import * as ReviewCtrl from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(ReviewCtrl.getReviews)
    .post(
        AuthCtrl.protect,
        AuthCtrl.restrictTo("user"),
        ReviewCtrl.createReview
    );

export default router;
