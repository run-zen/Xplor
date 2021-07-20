import express from "express";
import * as AuthCtrl from "../controllers/authControllers.js";
import * as ReviewCtrl from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router.use(AuthCtrl.protect);

router
    .route("/")
    .get(ReviewCtrl.getReviews)
    .post(
        AuthCtrl.restrictTo("user"),
        ReviewCtrl.setToursIds,
        ReviewCtrl.createReview
    );

router
    .route("/:id")
    .get(ReviewCtrl.getReview)
    .patch(AuthCtrl.restrictTo("admin", "user"), ReviewCtrl.updateReview)
    .delete(AuthCtrl.restrictTo("admin", "user"), ReviewCtrl.deleteReview);

export default router;
