import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { checkUserCredentials } from "../auth/auth-utils";
import { getUserInfoFromToken } from "../auth/auth-utils";
import * as orgUserModel from "../models/org-user.model";

export function getOrgUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getOrgUserById() in org-user.controller`);

  // Validate user_id
  const userIdNum = Number(req.params.user_id);
  if (Number.isNaN(userIdNum)) {
    next({ status: 400, msg: "user_id is not a number!" });

    return;
  }

  // Authorise user
  const authObj = checkUserCredentials(req, userIdNum, "organisation");
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

export function postOrgUser(req: Request, res: Response, next: NextFunction) {
  logger.debug("In postOrgUser() in org-user.controller");

  let {
    org_name,
    email,
    password,
    org_type,
    contact_tel,
    avatar_img_b64,
    bio,
  } = req.body;

  logger.debug(
    `Trying to register org where email: ${email} password: ${password} ` +
      `org_name: ${org_name} contact_tel: ${contact_tel} avatar_img_b64: ${avatar_img_b64} ` +
      `bio: ${bio}, orgType: ${org_type}`
  );

  // Make sure user is logged out
  if (getUserInfoFromToken(req)) {
    next({
      status: 400,
      msg: "You must be logged out to register!",
    });

    return;
  }

  // Register org user
  orgUserModel
    .createOrgUser(
      email,
      password,
      org_name,
      org_type,
      contact_tel,
      avatar_img_b64,
      bio
    )
    .then((orgUserObj) => {
      logger.info(`Successfully registered organisation user: ${orgUserObj}!`);

      // TODO: IMPORTANT!
      // Remove password from response
      // delete orgUserObj.org_password;

      res.status(200).send({ user: orgUserObj });

      return;
    })
    .catch((err) => {
      next(err);
    });
}
