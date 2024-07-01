import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as badgesModel from "../models/badges.model";

export function getBadges(req: Request, res: Response, next: NextFunction) {
  const { user_id } = req.params;
  logger.debug(`In getBadges() in badges.controller`);

  badgesModel
    .selectBadges(user_id)
    .then((badges) => {
      res.status(200).send(badges);
    })
    .catch((err) => {
      next(err);
    });
}
