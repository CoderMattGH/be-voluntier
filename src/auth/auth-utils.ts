import { logger } from "../logger";
import bcrypt from "bcryptjs";
import { Request } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import * as constants from "../constants";

interface TokenInterface {
  id: number;
  email: string;
  role: string;
}

const salt = "$2a$10$mjBiK50OQB2g.s.QXSV8zu";

// TODO: Change secret and store in .env
const SECRET_KEY: Secret = "keyboard-cat";

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

  // Try and parse token from header
  const token = parseTokenFromHeader(req);

  if (!token) {
    const respObj = { status: 401, msg: constants.ERR_MSG_NOT_LOGGED_IN };

    logger.info(`Authorisation failed (user not logged in)!`);

    return { authorised: false, respObj: respObj };
  }

  // Decipher token
  const decToken = decipherToken(token);

  if (!decToken.id || !decToken.email || !decToken.role) {
    const respObj = { status: 401, msg: "Unknown error parsing token!" };

    logger.info(`Unknown error parsing token!`);

    return { authorised: false, respObj: respObj };
  }

  if (decToken.id !== resourceUserId) {
    const respObj = { status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED };

    logger.info(
      `Authorisation failed for user: id: ${decToken.id}, ` +
        `email: ${decToken.email}, role: ${decToken.role}!`
    );

    return { authorised: false, respObj: respObj };
  }

  if (decToken.role !== resourceRole) {
    const respObj = { status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED };

    logger.info(
      `Authorisation failed for user: id: ${decToken.id}, ` +
        `email: ${decToken.email}, role: ${decToken.role}!`
    );

    return { authorised: false, respObj: respObj };
  }

  logger.info(
    `Authorisation granted for user: id: ${decToken.id}, ` +
      `email: ${decToken.email}, role: ${decToken.role}!`
  );

  return { authorised: true, respObj: null };
}

export function getUserInfoFromToken(req: Request) {
  // Try and parse token from header
  const token = parseTokenFromHeader(req);

  if (!token) {
    logger.info(`Parsing failed (user not logged in)!`);

    return null;
  }

  // Decipher token
  const decToken = decipherToken(token);

  if (!decToken.id || !decToken.email || !decToken.role) {
    logger.info(`Unknown error parsing token!`);

    return null;
  }

  return decToken;
}

function parseTokenFromHeader(req: Request) {
  // Try and parse token from header
  return req.header("Authorization")?.replace("Bearer ", "");
}

function decipherToken(token: string) {
  return <TokenInterface>jwt.verify(token, SECRET_KEY);
}

export function generateJWTToken(
  userId: number,
  userEmail: string,
  userRole: string
) {
  const token = jwt.sign(
    { id: userId, email: userEmail, role: userRole },
    SECRET_KEY,
    {
      expiresIn: "2 days",
    }
  );

  return token;
}
