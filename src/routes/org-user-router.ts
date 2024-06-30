import { Router } from "express";
import { getOrgUserById } from "../controllers/org-user.controller";

export const orgUserRouter = Router();

orgUserRouter.route("/:user_id").get(getOrgUserById);
