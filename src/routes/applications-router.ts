import { Router } from "express";
import {
  getApplication,
  getApplicationsByVolId,
  getApplicationsByOrgId,
} from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter.route("/:app_id").get(getApplication);
applicationsRouter.route("/vol/:vol_user_id").get(getApplicationsByVolId);
applicationsRouter.route("/org/:org_user_id").get(getApplicationsByOrgId);
