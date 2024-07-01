import { logger } from "../logger";

import * as volUserModel from "../models/vol-user.model";
import * as authUtils from "../auth/auth-utils";
import { Request, Response, NextFunction } from "express";

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

    return;
  }

  // Check user is not already logged in
  if (req.session.user) {
    next({
      status: 400,
      msg: "User is already logged in!",
    });

    return;
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
        next({ status: 401, msg: "Invalid username or password!" });
      }
    })
    .catch((err) => {
      logger.debug(`ERR: ${err}`);
      logger.debug(`Invalid username or password!`);

      next({ status: 401, msg: "Invalid username or password!" });
    });
}
