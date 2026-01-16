import jwt from "jsonwebtoken";
import "dotenv/config";

export const createToken = (id: string | number): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: id.toString() }, secret, {
    expiresIn: "7d",
  });
};
export const createAdminToken = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: process.env.ADMIN_ID, role: "admin" }, secret, {
    expiresIn: "1d",
  });
};
