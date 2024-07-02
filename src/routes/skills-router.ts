import { Router } from "express";
import { getSkills } from "../controllers/skills.controller";

export const skillsRouter = Router();

skillsRouter.route("/").get(getSkills);
