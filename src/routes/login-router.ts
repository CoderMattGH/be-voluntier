import { Router } from "express";
import { loginUser } from "../controllers/login.controller";

export const loginRouter = Router();

loginRouter.route("/").post(loginUser);
