import express from "express";
import { deleteUser, login, logout, register, update } from "./auth.js";
import { adminAuth, userAuth } from "../middleware/auth.js";

export const authRouter = express.Router();
authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(userAuth, logout);
authRouter.route("/update").put(adminAuth, update);
authRouter.route("/delete").delete(adminAuth, deleteUser);
