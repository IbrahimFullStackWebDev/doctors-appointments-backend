import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { type DecodedToken } from "../types/index.js";
const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.atoken) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid credentials" });
    }
    const decoded_token = jwt.verify(
      req.headers.atoken as string,
      process.env.JWT_SECRET!,
    ) as unknown as DecodedToken;

    if (
      decoded_token.id !== process.env.ADMIN_ID &&
      decoded_token.role !== "admin"
    ) {
      return res.json({ success: false, message: "Not an admin" });
    }
    next();
  } catch (error) {
    console.log(error);
    const err = error as Error;
    res.json({ success: false, message: err.message });
  }
};
export default authAdmin;
