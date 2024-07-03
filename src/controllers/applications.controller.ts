import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as applicationsModel from "../models/applications.model";
import { checkUserCredentials } from "../auth/auth-utils";

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
      res.status(200).send({ applications: applications });
    })
    .catch((err) => {
      next(err);
    });
}

export function getApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplication() in applications.controller`);

  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  applicationsModel
    .selectApplication(appIdNum.toString())
    .then((application) => {
      // Check if volunteer has access
      const volAuthObj = checkUserCredentials(
        req,
        application.vol_id,
        "volunteer"
      );

      // Check if organisation has access
      const orgAuthObj = checkUserCredentials(
        req,
        application.org_id,
        "organisation"
      );

      // If neither has authorisation, then reject
      if (!(orgAuthObj.authorised || volAuthObj.authorised)) {
        next(orgAuthObj.respObj);

        return;
      }

      res.status(200).send({ application: application });
    })
    .catch((err) => {
      next(err);
    });
}
