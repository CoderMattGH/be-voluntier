import { Router } from "express";
import {
  getVolUserById,
  postVolUser,
  patchVolUser,
} from "../controllers/vol-user.controller";

export const volUserRouter = Router();

volUserRouter.route("/").post(postVolUser);
volUserRouter.route("/:user_id").get(getVolUserById).patch(patchVolUser);
