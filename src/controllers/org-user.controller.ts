import { logger } from "../logger";
import * as orgUserModel from "../models/org-user.model";
import { Request, Response, NextFunction } from "express";

import * as constants from "../constants";

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

  // Check is user is logged in
  if (!req.session.user) {
    next({ status: 401, msg: constants.ERR_MSG_NOT_LOGGED_IN });

    return;
  }

  // Check user credentials
  if (
    req.session.user.id !== userIdNum ||
    req.session.user.role !== "organiser"
  ) {
    next({ status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED });

    return;
  }

  orgUserModel
    .selectOrgUserById(userIdNum.toString())
    .then((org_user) => {
      res.status(200).send({ org_user: org_user });
    })
    .catch((err) => {
      next(err);
    });
}
