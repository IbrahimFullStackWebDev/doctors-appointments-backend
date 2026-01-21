import express, { Router } from "express";
import {
  addDoctor,
  adminLogin,
  changeAvailability,
  changeStatus,
  getAllAppointments,
  getDoctors,
  getNumberOfDoctorsAndAppointmentsAndPatients,
} from "../controllers/adminCotroller.js";
import authAdmin from "../middlewares/authAdmin.js";
import { upload } from "../middlewares/multer.js";

const adminRouter: Router = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/doctors", authAdmin, getDoctors);
adminRouter.put("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/appointments", authAdmin, getAllAppointments);
adminRouter.put("/change-status", authAdmin, changeStatus);
adminRouter.post(
  "/get-statistics",
  authAdmin,
  getNumberOfDoctorsAndAppointmentsAndPatients,
);

export default adminRouter;
