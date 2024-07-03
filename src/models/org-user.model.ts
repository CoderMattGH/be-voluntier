import { logger } from "../logger";
import { db } from "../db";

export function selectOrgUserByEmail(email: string) {
  logger.debug(`In selectOrgUserByEmail() in org-user.model`);
  logger.info(`Searching for org_user with email: ${email}`);

  email = email.trim();

  const queryStr = `SELECT * FROM org_users WHERE org_users.org_email ILIKE $1;`;

  return db.query(queryStr, [email]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "org_user not found!" });
    }

    return rows[0];
  });
}

export function selectOrgUserById(user_id: string) {
  logger.debug("In selectOrgUserById() in org-user.model");
  logger.info(`Selecting user by Id: ${user_id}`);

  const queryStr = `SELECT * FROM org_users WHERE org_users.org_id = $1;`;

  return db.query(queryStr, [user_id]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "org_user not found!" });
    }

    return rows[0];
  });
}
