import { Router } from "express";
import {
  getApplication,
  getApplicationsByVolId,
  getApplicationsByOrgId,
  postApplication,
  deleteApplication,
  patchApplicationWithProvConfirm,
  patchApplicationWithFullConfirm,
} from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter
  .route("/:app_id")
  .get(getApplication)
  .delete(deleteApplication)
  .patch(patchApplicationWithProvConfirm);

applicationsRouter
  .route("/:app_id/confirm")
  .patch(patchApplicationWithFullConfirm);

applicationsRouter.route("/vol/:vol_user_id").get(getApplicationsByVolId);
applicationsRouter.route("/org/:org_user_id").get(getApplicationsByOrgId);

applicationsRouter.route("/").post(postApplication);
