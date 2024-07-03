import { Router } from "express";
import {
  getApplication,
  getApplicationsByVolId,
} from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter.route("/:app_id").get(getApplication);
applicationsRouter.route("/vol/:vol_user_id").get(getApplicationsByVolId);
