import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as orgTypesModel from "../models/org-types.model";

export function getOrgTypes(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In getOrgTypes() in org-types.controller`);

  orgTypesModel
    .selectOrgTypes()
    .then((orgTypes) => {
      res.status(200).send(orgTypes);
    })
    .catch((err) => {
      next(err);
    });
}
