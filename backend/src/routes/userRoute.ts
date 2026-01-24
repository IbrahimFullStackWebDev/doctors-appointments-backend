import express, { Router } from "express";
import {
  bookAppointment,
  changeStatus,
  getDoctors,
  getUserAppointments,
  paymentStripe,
  updatePayment,
  updateProfile,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.js";

const userRouter: Router = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/get-doctors", getDoctors);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.put(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile,
);
userRouter.post("/appointments", authUser, getUserAppointments);
userRouter.put("/change-status", authUser, changeStatus);
userRouter.post("/payment-stripe", upload.none(), authUser, paymentStripe);
userRouter.post("/update-payment", upload.none(), authUser, updatePayment);

export default userRouter;
