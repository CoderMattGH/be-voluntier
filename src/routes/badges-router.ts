import { Router } from "express";
import { getBadges } from "../controllers/badges.controller";

export const badgesRouter = Router();

badgesRouter.route("/").get(getBadges);
