import { Router } from "express";
import { getSkills, getSkillsByListId } from "../controllers/skills.controller";

export const skillsRouter = Router();

skillsRouter.route("/").get(getSkills);
skillsRouter.route("/:list_id").get(getSkillsByListId);
