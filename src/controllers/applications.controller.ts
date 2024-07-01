import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as applicationsModel from "../models/applications.model";

export function getApplications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplications() in applications.controller`);
  const { user_id } = req.params;

  applicationsModel
    .selectApplicationsByVolId(user_id)
    .then((applications) => {
      res.status(200).send(applications);
    })
    .catch((err) => {
      next(err);
    });
}
