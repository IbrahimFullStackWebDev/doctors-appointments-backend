import express, { Router } from "express";
import {
  addDoctor,
  adminLogin,
  getDoctors,
} from "../controllers/adminCotroller.js";
import authAdmin from "../middlewares/authAdmin.js";
import { upload } from "../middlewares/multer.js";

const adminRouter: Router = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/doctors", authAdmin, getDoctors);

export default adminRouter;
