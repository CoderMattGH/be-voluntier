import { Router } from "express";
import { logoutUser } from "../controllers/login.controller";

export const logoutRouter = Router();

logoutRouter.route("/").post(logoutUser);
