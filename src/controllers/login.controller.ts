import { logger } from "../logger";

import * as volUserModel from "../models/vol-user.model";
import * as authUtils from "../auth/auth-utils";
import { Request, Response, NextFunction } from "express";

// TODO: Organiser and Admin roles
// TODO: Validation
export function loginUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In loginUser() in login.controller`);

  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  logger.info(
    `Trying to login user where email:${email} password:${password} role:${role}`
  );

  const availRoles = ["volunteer", "organiser"];

  // Validate role
  if (!role || !availRoles.includes(role.toLowerCase())) {
    next({ status: 400, msg: "Invalid role provided!" });
  }

  volUserModel
    .selectVolUserByEmail(email)
    .then((volUser) => {
      if (authUtils.checkPassword(password, volUser.vol_password)) {
        logger.debug(`Username and password are OK!`);

        // Attach user object to session
        req.session.user = {
          id: volUser.vol_id,
          email: volUser.vol_email,
          role: role,
        };

        res.status(200).send({ msg: "Login successful!" });
      } else {
        throw new Error("Invalid username or password!");
      }
    })
    .catch((err) => {
      logger.debug(`ERR: ${err}`);
      logger.debug(`Invalid username or password!`);

      next({ status: 401, msg: "Invalid username or password!" });
    });
}
