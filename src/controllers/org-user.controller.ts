import { logger } from "../logger";

import * as orgUserModel from "../models/org-user.model";
import { Request, Response, NextFunction } from "express";

export function getOrgUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user_id } = req.params;
  logger.debug(`In getOrgUserById() in org-user.controller`);

  orgUserModel
    .selectOrgUserById(user_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}
