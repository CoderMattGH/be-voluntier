import { Router } from "express";
import { getApplication } from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter.route("/:app_id").get(getApplication);
