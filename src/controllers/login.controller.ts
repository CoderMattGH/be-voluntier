import { logger } from "../logger";
import { generateJWTToken } from "../auth/auth-utils";
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

  // Check user is not already logged in
  if (authUtils.getUserInfoFromToken(req)) {
    next({ status: 400, msg: "User is already logged in!" });

    return;
  }

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

  role = role.toLowerCase();

  const invalidError = { status: 401, msg: "Invalid email or password!" };

  let modelPromise;
  if (role === "volunteer") {
    modelPromise = volUserModel.selectVolUserByEmail(email).then((volUser) => {
      if (!authUtils.checkPassword(password, volUser.vol_password)) {
        return Promise.reject(invalidError);
      }

      const tokObj = {
        id: volUser.vol_id,
        email: volUser.vol_email,
        role: role,
      };

      return { user: volUser, tokObj };
    });
  } else {
    modelPromise = orgUserModel.selectOrgUserByEmail(email).then((orgUser) => {
      if (!authUtils.checkPassword(password, orgUser.org_password)) {
        return Promise.reject(invalidError);
      }

      const tokObj = {
        id: orgUser.org_id,
        email: orgUser.org_email,
        role: role,
      };

      return { user: orgUser, tokObj };
    });
  }

  modelPromise
    .then((userObj) => {
      logger.debug(`Email and password are OK!`);

      const { user, tokObj } = userObj;
      delete user.vol_password;
      delete user.org_password;
      user.role = role;

      // Generate and attach token
      const token = generateJWTToken(tokObj.id, tokObj.email, tokObj.role);
      userObj.user.token = token;

      logger.debug(`Sending JWT Token!`);

      res.status(200).send({ user: userObj.user });
    })
    .catch((err) => {
      logger.debug(`ERR: ${err}`);
      logger.debug(`Login error!`);
      next(err);
    });
}
