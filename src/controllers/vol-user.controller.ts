import { logger } from "../logger";
import { checkUserCredentials } from "../auth/auth-utils";
import { Request, Response, NextFunction } from "express";
import * as volUserModel from "../models/vol-user.model";

export function getVolUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getVolUserById() in vol-user.controller`);

  // Validate user_id
  const userIdNum = Number(req.params.user_id);
  if (Number.isNaN(userIdNum)) {
    next({ status: 400, msg: "user_id is not a number!" });

    return;
  }

  // Authorise user
  const authObj = checkUserCredentials(req, userIdNum, "volunteer");
  if (!authObj.authorised) {
    next(authObj.respObj);

    return;
  }

  volUserModel
    .selectVolUserById(userIdNum.toString())
    .then((vol_user) => {
      // Remove password from results
      delete vol_user.vol_password;

      res.status(200).send({ vol_user: vol_user });
    })
    .catch((err) => {
      next(err);
    });
}
