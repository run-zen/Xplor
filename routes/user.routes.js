import express from "express";
import * as UserCtrl from "../controllers/user.controllers.js";
import * as AuthCtrl from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", AuthCtrl.signup);
router.post("/login", AuthCtrl.login);

router
    .route("/")
    .get(UserCtrl.getAllUsers)
    .post(UserCtrl.createUser);
router
    .route("/:id")
    .get(UserCtrl.getUser)
    .patch(UserCtrl.updateUser)
    .delete(UserCtrl.deleteUser);

export default router;
