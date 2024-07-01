import { logger } from "../logger";

import * as volUserModel from "../models/vol-user.model";
import * as orgUserModel from "../models/org-user.model";
import * as authUtils from "../auth/auth-utils";
import { Request, Response, NextFunction } from "express";

export function loginUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In loginUser() in login.controller`);

  const email = req.body.email;
  const password = req.body.password;
  let role = req.body.role;

  logger.info(
    `Trying to login user where email:${email} password:${password} role:${role}`
  );

  const availRoles = ["volunteer", "organiser"];

  // Validate role
  if (!role || !availRoles.includes(role.toLowerCase())) {
    next({ status: 400, msg: "Invalid role provided!" });

    return;
  }

  // Check user is not already logged in
  if (req.session.user) {
    next({
      status: 400,
      msg: "A user is already logged in!",
    });

    return;
  }

  role = role.toLowerCase();

  const invalidError = { status: 401, msg: "Invalid username or password!" };

  let modelPromise;
  if (role === "volunteer") {
    modelPromise = volUserModel.selectVolUserByEmail(email).then((volUser) => {
      if (!authUtils.checkPassword(password, volUser.vol_password)) {
        return Promise.reject(invalidError);
      }

      return {
        id: volUser.vol_id,
        email: volUser.vol_email,
        role: role,
      };
    });
  } else {
    modelPromise = orgUserModel.selectOrgUserByEmail(email).then((orgUser) => {
      if (!authUtils.checkPassword(password, orgUser.org_password)) {
        return Promise.reject(invalidError);
      }

      return {
        id: orgUser.org_id,
        email: orgUser.org_email,
        role: role,
      };
    });
  }

  modelPromise
    .then((userObj) => {
      logger.debug(`Username and password are OK!`);
      // Attach user object to session
      req.session.user = {
        id: userObj.id,
        email: userObj.email,
        role: role,
      };

      res.status(200).send({ msg: "Login successful!" });
    })
    .catch((err) => {
      logger.debug(`ERR: ${err}`);
      logger.debug(`Login error!`);
      next(err);
    });
}
