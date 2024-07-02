import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as skillsModel from "../models/skills.model";

export function getSkills(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In getSkills() in skills.controller`);

  skillsModel
    .selectSkills()
    .then((skills) => {
      res.status(200).send(skills);
    })
    .catch((err) => {
      next(err);
    });
}
