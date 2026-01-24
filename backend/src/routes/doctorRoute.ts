import express, { Router } from "express";
import {
  changeStatus,
  doctorLogin,
  getAllAppointments,
  getNumberOfAppointmentsAndPatientsAndEarnigingsTotal,
  updateProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
import { upload } from "../middlewares/multer.js";

const doctorRouter: Router = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.post(
  "/get-statistics",
  authDoctor,
  getNumberOfAppointmentsAndPatientsAndEarnigingsTotal,
);
doctorRouter.post("/appointments", authDoctor, getAllAppointments);
doctorRouter.put("/change-status", authDoctor, changeStatus);
doctorRouter.put("/update-profile", upload.none(), authDoctor, updateProfile);

export default doctorRouter;
