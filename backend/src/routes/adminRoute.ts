import express, { Router } from "express";
import { addDoctor, adminLogin } from "../controllers/adminCotroller.js";
import authAdmin from "../middlewares/authAdmin.js";
import { upload } from "../middlewares/multer.js";

const adminRouter: Router = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

export default adminRouter;
