import { Router } from "express";
import {
  getApplication,
  getApplicationsByVolId,
  getApplicationsByOrgId,
  postApplication,
  deleteApplication,
  patchApplicationConfirm,
  getApplications,
  patchAppAttendance,
} from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter
  .route("/:app_id")
  .get(getApplication)
  .delete(deleteApplication)
  .patch(patchApplicationConfirm);

applicationsRouter
  .route("/:app_id/confirm-attendance")
  .patch(patchAppAttendance);

applicationsRouter.route("/vol/:vol_user_id").get(getApplicationsByVolId);
applicationsRouter.route("/org/:org_user_id").get(getApplicationsByOrgId);

applicationsRouter.route("/").get(getApplications).post(postApplication);
