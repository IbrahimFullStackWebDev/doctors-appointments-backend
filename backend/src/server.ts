import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://doctors-appointments-admin-8v9p.onrender.com",
      "http://localhost:5173",
    ],
  }),
);

const Port: string | number = (process.env.PORT as string) || 4000;

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.listen(Port, () => {
  console.log(`Server is running on: http://localhost:${Port}`);
});
