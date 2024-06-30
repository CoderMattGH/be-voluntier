import { Router } from "express";
import { getApplications } from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter.route("/").get(getApplications);
