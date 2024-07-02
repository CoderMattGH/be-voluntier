import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as leaderboardModel from "../models/leaderboard.model";

export function getLeaderboard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getLeaderboard() in leaderboard.controller`);

  leaderboardModel
    .selectLeaderboard()
    .then((leaderboard) => {
      res.status(200).send(leaderboard);
    })
    .catch((err) => {
      next(err);
    });
}
