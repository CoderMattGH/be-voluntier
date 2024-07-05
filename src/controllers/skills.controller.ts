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

export function getSkillsByListId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getSkillsByListId() in skills.controller`);

  const listIdNum = Number(req.params.list_id);

  if (Number.isNaN(listIdNum)) {
    next({ status: 400, msg: "list_id is not a number!" });

    return;
  }

  skillsModel.selectSkillsByListId(listIdNum).then((skills) => {
    if (!skills.length) {
      next({ status: 404, msg: "No skills found!" });

      return;
    }

    res.status(200).send({ skills });
  });
}
