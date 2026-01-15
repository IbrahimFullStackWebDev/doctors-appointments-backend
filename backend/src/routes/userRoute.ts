import express, { Router } from "express";
import { userLogin, userRegister } from "../controllers/userController.js";

const userRouter: Router = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);

export default userRouter;
