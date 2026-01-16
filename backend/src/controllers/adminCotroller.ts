import { Request, Response } from "express";
import "dotenv/config";
import { createAdminToken } from "../utils/createTokens.js";
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
    }
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(404).json({ success: false, message: err.message });
  }
};
