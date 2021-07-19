import express from "express";
import * as UserCtrl from "../controllers/user.controllers.js";
import * as AuthCtrl from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", AuthCtrl.signup, AuthCtrl.sendConfirmationEmail);
router.post("/resendemailconfirmationToken", AuthCtrl.sendConfirmationEmail);
router.patch("/confirmemail/:token", AuthCtrl.confirmEmail);
router.post("/login", AuthCtrl.login);

router.post("/forgotpassword", AuthCtrl.forgotPassword);
router.patch("/resetpassword/:token", AuthCtrl.resetPassword);
router.patch("/updatepassword", AuthCtrl.protect, AuthCtrl.updatePassword);
router.patch("/updateme", AuthCtrl.protect, UserCtrl.updateMe);
router.delete("/deleteme", AuthCtrl.protect, UserCtrl.deleteMe);

router.route("/").get(UserCtrl.getAllUsers).post(UserCtrl.createUser);
router
    .route("/:id")
    .get(UserCtrl.getUser)
    .patch(UserCtrl.updateUser)
    .delete(UserCtrl.deleteUser);

export default router;
