import { Router } from "express";
import {
  getOrgUserById,
  postOrgUser,
} from "../controllers/org-user.controller";

export const orgUserRouter = Router();

orgUserRouter.route("/:user_id").get(getOrgUserById);

orgUserRouter.route("/").post(postOrgUser);
