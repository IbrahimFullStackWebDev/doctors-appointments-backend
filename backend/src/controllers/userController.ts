import { supabase } from "../config/supabase.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import createToken from "../utils/createToken.js";
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
