import { logger } from "../logger";

import { Request, Response, NextFunction } from "express";

// TODO: Error handling
// TODO: Validation
export function logoutUser(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In logoutUser() in login.controller`);
  logger.info(`Logging out user: ${req.session.user}`);

  if (req.session.user) {
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
