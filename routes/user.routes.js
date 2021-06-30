import express from "express";
import UserCtrl from "../controllers/user.controllers.js";
const router = express.Router();

router.route("/").get(UserCtrl.getAllUsers).post(UserCtrl.createUser);
router
  .route("/:id")
  .get(UserCtrl.getUser)
  .patch(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

export default router;
