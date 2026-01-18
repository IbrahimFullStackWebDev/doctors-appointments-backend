import { supabase } from "../config/supabase.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createToken } from "../utils/createTokens.js";
import { BookAppointmentsType, DoctorDataType } from "../types/index.js";
export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details." });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) {
      if (error?.code === "23505") {
        return res.json({ success: false, message: "Email already exists" });
      }
      throw error;
    }
    const uToken = createToken(data[0].id);
    res.json({
      success: true,
      message: "User registered successfully",
      uToken: uToken,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const uToken = createToken(user.id);
      res.json({ success: true, uToken });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from<"doctors", DoctorDataType[]>("doctors")
      .select(
        "id, name, email, image, speciality, degree, experience, available, about, fees, address",
      );
    if (error) throw error;
    res.json({
      success: true,
      message: "Get all doctors successful.",
      doctors: data,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(404).json({ success: false, message: err.message });
  }
};

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { doctorId, slotDate, slotTime, amount } =
      req.body as BookAppointmentsType;

    if (!doctorId || !slotDate || !slotTime || !amount) {
      return res.json({ success: false, message: "Missing Details." });
    }

    const { data, error: fetchError } = await supabase
      .from("appointments")
      .select("id")
      .eq("doc_id", doctorId)
      .eq("slot_date=", slotDate)
      .eq("slot_time=", slotTime)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (data) {
      return res.json({
        success: false,
        message: "This Slot Is Already Booked.",
      });
    } else {
      const { data, error: insertError } = await supabase
        .from("appointments")
        .insert([
          {
            user_id: req.body.userId,
            doc_id: doctorId,
            slot_date: slotDate,
            slot_time: slotTime,
            amount: Number(amount),
          },
        ])
        .select();
      if (insertError) {
        if (insertError?.code === "23505") {
          return res.json({
            success: false,
            message: "This Slot Is Already Booked.",
          });
        }
        return res.json({
          success: false,
          message: insertError?.message,
        });
      }

      res.json({
        success: true,
        message: "Create an Appointment successful.",
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
