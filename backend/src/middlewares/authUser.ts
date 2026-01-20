import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { type DecodedToken } from "../types/index.js";
const authUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.utoken) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid credentials" });
    }
    const decoded_token = jwt.verify(
      req.headers.utoken as string,
      process.env.JWT_SECRET!,
    ) as unknown as DecodedToken;

    if (!decoded_token.id || decoded_token.role !== "user") {
      return res.json({ success: false, message: "Not an user" });
    }
    req.body.userId = Number(decoded_token.id);
    next();
  } catch (error) {
    console.log(error);
    const err = error as Error;
    res.json({ success: false, message: err.message });
  }
};
export default authUser;
