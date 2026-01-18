import { Request, Response } from "express";
import "dotenv/config";
import { createAdminToken } from "../utils/createTokens.js";
import { type DoctorDataType } from "../types/index.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";
import uploadImage from "../utils/uploadImage.js";
export const adminLogin = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ succss: false, message: "Missing Details." });
    }

    if (
      process.env.ADMIN_EMALI === email &&
      process.env.ADMIN_PASSWORD === password
    ) {
      const aToken: string = createAdminToken();
      return res.json({
        success: true,
        message: "Admin Login Successful.",
        aToken: aToken,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(404).json({ success: false, message: err.message });
  }
};

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body as DoctorDataType;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
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
    let imageUrl: string = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from("doctors")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          speciality,
          degree,
          experience,
          about,
          image: imageUrl,
          fees: Number(fees),
          address,
          date: Date.now(),
        },
      ])
      .select();

    if (error) {
      if (error?.code === "23505") {
        return res.json({ success: false, message: "Email already exists" });
      }
      throw error;
    }
    res.json({
      success: true,
      message: "Adding Doctor successful.",
    });
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

export const changeAvailability = async (req: Request, res: Response) => {
  try {
    const { available, doctorId } = req.body;
    if (doctorId === undefined || available === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const { error } = await supabase
      .from("doctors")
      .update({ available: Boolean(available) })
      .eq("id", Number.parseInt(doctorId));
    if (error) throw error;
    res.json({
      success: true,
      message: "Update doctor availability successful.",
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
