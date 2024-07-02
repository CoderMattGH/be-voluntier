import { Router } from "express";
import { getOrgTypes } from "../controllers/org-types.controller";

export const orgTypesRouter = Router();

orgTypesRouter.route("/").get(getOrgTypes);
