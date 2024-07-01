import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { checkUserCredentials } from "../auth/auth-utils";
import * as orgUserModel from "../models/org-user.model";

export function getOrgUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user_id } = req.params;
  logger.debug(`In getOrgUserById() in org-user.controller`);

  // Validate user_id
  if (Number.isNaN(user_id)) {
    next({ status: 400, msg: "user_id is not a number!" });

    return;
  }

  const userIdNum = Number(user_id);

  // Authorise user
  const authObj = checkUserCredentials(req, userIdNum, "organiser");
  if (!authObj.authorised) {
    next(authObj.respObj);

    return;
  }

  orgUserModel
    .selectOrgUserById(userIdNum.toString())
    .then((org_user) => {
      // Remove password from results
      delete org_user.org_password;

      res.status(200).send({ org_user: org_user });
    })
    .catch((err) => {
      next(err);
    });
}
