import { Router } from "express";
import { getImage } from "../controllers/images.controller";

export const imageRouter = Router();

imageRouter.route("/:img_id").get(getImage);
