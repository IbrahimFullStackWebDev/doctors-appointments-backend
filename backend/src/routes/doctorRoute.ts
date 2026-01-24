import express, { Router } from "express";
import {
  changeStatus,
  doctorLogin,
  getAllAppointments,
  getNumberOfAppointmentsAndPatientsAndEarnigingsTotal,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter: Router = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.post(
  "/get-statistics",
  authDoctor,
  getNumberOfAppointmentsAndPatientsAndEarnigingsTotal,
);
doctorRouter.post("/appointments", authDoctor, getAllAppointments);
doctorRouter.put("/change-status", authDoctor, changeStatus);

export default doctorRouter;
