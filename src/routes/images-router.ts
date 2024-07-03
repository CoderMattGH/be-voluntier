import { Router } from "express";
import { getImage } from "../controllers/images.controller";

export const imageRouter = Router();

imageRouter.route("/").get(getImage);
