import "dotenv/config";
import { Request, Response } from "express";
import { createToken } from "../utils/createTokens.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details." });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const { data: doctor, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !doctor) {
      return res.json({ success: false, message: "Doctor does not exist" });
    }
    const isMatch: boolean = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const dToken = createToken(doctor.id, "doctor");
      res.json({
        success: true,
        message: "Doctor Login Successful.",
        dToken: dToken,
        doctorInfo: doctor,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNumberOfAppointmentsAndPatientsAndEarnigingsTotal = async (
  req: Request,
  res: Response,
) => {
  const docId = Number(req.body.doctorId);
  console.log(docId);
  try {
    const [earningsRes, appointmentsRes, usersRes] = await Promise.all([
      supabase.rpc("get_earnings_for_doctor_dashboard", {
        p_doc_id: docId,
      }),
      supabase.rpc("get_appointment_for_doctor_dashboard", {
        p_doc_id: docId,
      }),
      supabase.rpc("get_user_for_doctor_dashboard", {
        p_doc_id: docId,
      }),
    ]);
    const stats = {
      earnings: earningsRes.data,
      appointments: appointmentsRes.data,
      patients: usersRes.data,
    };

    res.json({
      success: true,
      message: "Get All Statistics is successful.",
      statistics: stats,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        slot_date,
        slot_time,
        amount,
        payment,
        status
    ,
    doctors:doc_id (
      name,
      image
    ),
     users:user_id (
      name,
      dob,
      image
    )
  `,
      )
      .not("doc_id", "is", null)
      .not("user_id", "is", null)
      .eq("doc_id", req.body.doctorId);

    if (error) console.log("Error:", error);

    if (error) throw error;

    const formattedData = data.map((item) => ({
      AppointmentInfo: {
        id: item.id,
        slotDate: item.slot_date,
        slotTime: item.slot_time,
        amount: item.amount,
        status: item.status,
        payment: item.payment,
      },
      doctorInfo: item.doctors,
      patientInfo: item.users,
    }));

    res.json({
      success: true,
      message: "Get all appointments are successful.",
      allAppointments: formattedData,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(404).json({ success: false, message: err.message });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { status, appointmentID } = req.body;
    console.log(status);
    if (status === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", Number.parseInt(appointmentID));
    if (error) throw error;
    res.json({
      success: true,
      message: `${status} the appointment is successful.`,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fees, address, available } = req.body;

    const { error } = await supabase
      .from("doctors")
      .update({
        fees: Number(fees),
        address: JSON.parse(address),
        available: available === "true" ? true : false,
      })
      .eq("id", Number.parseInt(req.body.doctorId));
    if (error) throw error;
    res.json({
      success: true,
      message: "Update doctor Information is successful.",
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
