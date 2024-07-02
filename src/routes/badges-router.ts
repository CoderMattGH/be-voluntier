import { Router } from "express";
import { getBadges, getBadgesByUserId } from "../controllers/badges.controller";

export const badgesRouter = Router();

badgesRouter.route("/").get(getBadges);

badgesRouter.route("/:user_id").get(getBadgesByUserId);
