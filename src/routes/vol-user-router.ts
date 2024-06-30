import { Router } from "express";
import { getVolUserById } from "../controllers/vol-user.controller";

export const volUserRouter = Router();

volUserRouter.route("/:user_id").get(getVolUserById);
