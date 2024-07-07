import { logger } from "../logger";
import { checkUserCredentials, getUserInfoFromToken } from "../auth/auth-utils";
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

  // Make sure user is logged out
  if (getUserInfoFromToken(req)) {
    next({
      status: 400,
      msg: "You must be logged out to register!",
    });

    return;
  }

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

      // Remove password from response.
      delete userObj.vol_password;

      res.status(200).send({ user: userObj });

      return;
    })
    .catch((err) => {
      next(err);
    });
}

export function patchVolUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In patchVolUser() in vol-user.controller`);

  const changes = req.body;
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

  if ("email" in changes && changes.email === "") {
    next({ status: 400, msg: "Email cannot be empty!" });
    return;
  }

  if ("password" in changes && changes.password === "") {
    next({ status: 400, msg: "Password cannot be empty!" });
    return;
  }

  if ("contactTel" in changes && changes.contactTel === "") {
    next({ status: 400, msg: "Contact Telephone cannot be empty!" });
    return;
  }

  if ("firstName" in changes && changes.firstName === "") {
    next({ status: 400, msg: "Name cannot be empty!" });
    return;
  }

  if ("lastName" in changes && changes.lastName === "") {
    next({ status: 400, msg: "Name cannot be empty!" });
    return;
  }

  if (Object.keys(changes).length === 0) {
    next({ status: 400, msg: "No changes provided" });
    return;
  }

  volUserModel
    .updateVolUser(userIdNum, changes)
    .then((updateResult) => {
      if (!updateResult) {
        next({ status: 404, msg: "User not found" });
        return;
      }

      const { success, changedFields } = updateResult;
      const message = `Update successful: ${changedFields.join(
        " and "
      )} changed`;
      res.status(200).send({ message });
    })
    .catch(next);
}
