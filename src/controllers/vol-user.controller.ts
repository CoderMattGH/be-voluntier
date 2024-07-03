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

// Register user
export function postVolUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In postVolUser() in vol-user.controller`);

  // Be careful, can be undefined!
  let {
    email,
    password,
    first_name,
    last_name,
    contact_tel,
    avatar_img_b64,
    bio,
  } = req.body;

  logger.debug(
    `Trying to register use where email: ${email} password: ${password} ` +
      `first_name: ${first_name} contact_tel: ${contact_tel}`
  );

  volUserModel
    .createVolUser(
      email,
      password,
      first_name,
      last_name,
      contact_tel,
      avatar_img_b64,
      bio
    )
    .then((userObj) => {
      logger.info(`Successfully registered user ${email}!`);
      console.log(userObj);

      // Remove password from response.
      delete userObj.vol_password;

      res.status(200).send({ user: userObj });

      return;
    })
    .catch((err) => {
      next(err);
    });
}
