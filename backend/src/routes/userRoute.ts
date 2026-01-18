import express, { Router } from "express";
import {
  bookAppointment,
  getDoctors,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter: Router = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/get-doctors", getDoctors);
userRouter.post("/book-appointment", authUser, bookAppointment);

export default userRouter;
