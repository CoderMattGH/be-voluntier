import { logger } from "../logger";

import { Request, Response, NextFunction } from "express";

export function logoutUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In logoutUser() in login.controller`);
  logger.info(`Trying to log out user!`);

  if (req.session.user) {
    logger.info(
      `Logging out user: [${req.session.user.id}, ${req.session.user.email}, ${req.session.user.role}]`
    );

    req.session.destroy(() => {
      logger.debug("User session destroyed!");

      // req.session.user = null;
      res.clearCookie("connect.sid");
      res.status(200).send();
    });
  } else {
    logger.debug("User was not logged in!");

    next({ status: 400, msg: "User not logged in!" });
  }
}
