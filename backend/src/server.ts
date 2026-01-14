import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

const Port: string | number = (process.env.PORT as string) || 4000;

app.listen(Port, () => {
  console.log(`Server is running on: http://localhost:${Port}`);
});
