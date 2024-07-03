import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as applicationsModel from "../models/applications.model";
import { checkUserCredentials } from "../auth/auth-utils";

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

export function getApplicationsByVolId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplicationsByVolId() in applications.controller`);

  const volIdNum = Number(req.params.vol_user_id);
  if (Number.isNaN(volIdNum)) {
    next({ status: 400, msg: "vol_user_id is not a number!" });

    return;
  }

  applicationsModel
    .selectApplicationsByVolId(volIdNum.toString())
    .then((applications) => {
      const volAuthObj = checkUserCredentials(req, volIdNum, "volunteer");

      if (!volAuthObj.authorised) {
        next(volAuthObj.respObj);

        return;
      }

      res.status(200).send({ applications: applications });
    })
    .catch((err) => {
      next(err);
    });
}
