import express, { Router } from "express";
import { adminLogin } from "../controllers/adminCotroller.js";

const adminRouter: Router = express.Router();

adminRouter.post("/login", adminLogin);

export default adminRouter;
