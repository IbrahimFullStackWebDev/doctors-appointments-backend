import { supabase } from "../config/supabase.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createToken } from "../utils/createTokens.js";
import { BookAppointmentsType, DoctorDataType } from "../types/index.js";
import "dotenv/config";
import uploadImage from "../utils/uploadImage.js";
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

    const { data: user, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) {
      if (error?.code === "23505") {
        return res.json({ success: false, message: "Email already exists" });
      }
      throw error;
    }
    const uToken = createToken(user[0].id);
    res.json({
      success: true,
      message: "User registered successfully",
      uToken: uToken,
      user: user,
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

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const uToken = createToken(user.id);
      res.json({
        success: true,
        message: "User Login Successful.",
        uToken,
        user: user,
      });
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, gender, dob } = req.body;
    let imageUrl: string = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file);
      const { error } = await supabase
        .from("users")
        .update({ image: imageUrl })
        .eq("id", Number.parseInt(req.body.userId));
      if (error) throw error;
    }

    const { error } = await supabase
      .from("users")
      .update({
        name,
        email,
        phone,
        address: JSON.parse(address),
        gender,
        dob: Number(dob),
      })
      .eq("id", Number.parseInt(req.body.userId));
    if (error) throw error;
    res.json({
      success: true,
      message: "Update doctor availability successful.",
      imageUrl,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        doc_id,
        slot_date,
        slot_time,
        amount,
        payment,
        status
    ,
    doctors:doc_id (
      name,
      speciality,
      image,
      address
    )
  `,
      )
      .eq("user_id", Number(req.body.userId))
      .not("doc_id", "is", null)
      .not("user_id", "is", null);

    if (error) console.log("Error:", error);

    if (error) throw error;

    const formattedData = data.map((item) => ({
      AppointmentsInfo: {
        id: item.id,
        doctorId: item.doc_id,
        slotDate: item.slot_date,
        slotTime: item.slot_time,
        amount: item.amount,
        status: item.status,
        payment: item.payment,
      },
      doctorInfo: item.doctors,
    }));

    res.json({
      success: true,
      message: "Get all user appointments successful.",
      userAppointments: formattedData,
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
      message: "Cancel the appointment is successful.",
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentStripe = async (req: Request, res: Response) => {
  try {
    const { appointmentId, doctorName } = req.body;
    const { origin } = req.headers;

    const { data: appointmentData, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", Number(appointmentId))
      .single();

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or Not Found",
      });
    }

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Appointment with Dr. ${doctorName}`,
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/my-appointments?success=true&appointmentId=${appointmentId}`,
      cancel_url: `${origin}/my-appointments?success=false`,
      line_items: line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const updatePayment = async (req: any, res: any) => {
  try {
    const { appointmentId, success } = req.body;

    if (success === "true") {
      const { error } = await supabase
        .from("appointments")
        .update({ payment: true })
        .eq("id", Number.parseInt(appointmentId));
      res.json({ success: true, message: "Payment updated successfully" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};
