import { Router } from "express";
import { logoutUser } from "../controllers/logout.controller";

export const logoutRouter = Router();

logoutRouter.route("/").post(logoutUser);
