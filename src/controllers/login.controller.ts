import { logger } from "../logger";
import * as volUserModel from "../models/vol-user.model";
import * as orgUserModel from "../models/org-user.model";
import * as authUtils from "../auth/auth-utils";
import * as loginValidator from "../validators/login.validator";
import { Request, Response, NextFunction } from "express";

export function loginUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In loginUser() in login.controller`);

  const email = req.body.email;
  const password = req.body.password;
  let role = req.body.role;

  logger.info(
    `Trying to login user where email:${email} password:${password} role:${role}`
  );

  // Validate login email
  const emailValObj = loginValidator.validateLoginEmail(email);
  if (!emailValObj.valid) {
    next({ status: 400, msg: emailValObj.msg });

    return;
  }

  // Validate password
  const passValObj = loginValidator.validateLoginPassword(password);
  if (!passValObj.valid) {
    next({ status: 400, msg: passValObj.msg });

    return;
  }

  const availRoles = ["volunteer", "organisation"];

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

  const invalidError = { status: 401, msg: "Invalid email or password!" };

  let modelPromise;
  if (role === "volunteer") {
    modelPromise = volUserModel.selectVolUserByEmail(email).then((volUser) => {
      if (!authUtils.checkPassword(password, volUser.vol_password)) {
        return Promise.reject(invalidError);
      }

      const sessObj = {
        id: volUser.vol_id,
        email: volUser.vol_email,
        role: role,
      };

      return { user: volUser, sessObj };
    });
  } else {
    modelPromise = orgUserModel.selectOrgUserByEmail(email).then((orgUser) => {
      if (!authUtils.checkPassword(password, orgUser.org_password)) {
        return Promise.reject(invalidError);
      }

      const sessObj = {
        id: orgUser.org_id,
        email: orgUser.org_email,
        role: role,
      };

      return { user: orgUser, sessObj };
    });
  }

  modelPromise
    .then((userObj) => {
      logger.debug(`Email and password are OK!`);

      const { sessObj } = userObj;
      req.session.user = {
        id: sessObj.id,
        email: sessObj.email,
        role: role,
      };

      const { user } = userObj;
      delete user.vol_password;
      delete user.org_password;
      user.role = role;

      res.status(200).send({ user: userObj.user });
    })
    .catch((err) => {
      logger.debug(`ERR: ${err}`);
      logger.debug(`Login error!`);
      next(err);
    });
}
