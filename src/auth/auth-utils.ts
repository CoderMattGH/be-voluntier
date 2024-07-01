import { logger } from "../logger";
import bcrypt from "bcryptjs";
import { Request } from "express";
import * as constants from "../constants";

const salt = "$2a$10$mjBiK50OQB2g.s.QXSV8zu";

export function hashPassword(password: string) {
  let hash = bcrypt.hashSync(password, salt);

  return hash;
}

export function checkPassword(password: string, hash: string) {
  const hashedPass = hashPassword(password);

  return hashedPass === hash;
}

export function checkUserCredentials(
  req: Request,
  resourceUserId: number,
  resourceRole: string
): { authorised: boolean; respObj: { status: number; msg: string } | null } {
  logger.debug(`In checkUserCredentials() in auth-utils`);
  logger.info(
    `Authorising resource_id: ${resourceUserId} with req. role: ${resourceRole}`
  );

  if (!req.session || !req.session.user) {
    const respObj = { status: 401, msg: constants.ERR_MSG_NOT_LOGGED_IN };

    logger.info(`Authorisation failed (user not logged in)!`);

    return { authorised: false, respObj: respObj };
  }

  if (req.session.user.id !== resourceUserId) {
    const respObj = { status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED };

    logger.info(
      `Authorisation failed for user: id: ${req.session.user.id}, ` +
        `email: ${req.session.user.email}, role: ${req.session.user.role}!`
    );

    return { authorised: false, respObj: respObj };
  }

  if (req.session.user.role !== resourceRole) {
    const respObj = { status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED };

    logger.info(
      `Authorisation failed for user: id: ${req.session.user.id}, ` +
        `email: ${req.session.user.email}, role: ${req.session.user.role}!`
    );

    return { authorised: false, respObj: respObj };
  }

  logger.info(
    `Authorisation granted for user: id: ${req.session.user.id}, ` +
      `email: ${req.session.user.email}, role: ${req.session.user.role}!`
  );

  return { authorised: true, respObj: null };
}
