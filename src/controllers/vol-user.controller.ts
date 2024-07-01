import { logger } from "../logger";

import * as volUserModel from "../models/vol-user.model";
import { Request, Response, NextFunction } from "express";

export function getVolUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user_id } = req.params;
  logger.debug(`In getVolUserById() in vol-user.controller`);

  volUserModel
    .selectVolUserById(user_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}
