import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./auth/authRoute.js";
import connectDB from "./db.js";
import { adminAuth, userAuth } from "./middleware/auth.js";

const app = express();
const PORT = 3001;

connectDB();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("Basic Route"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
