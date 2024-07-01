import { logger } from "../logger";
import { db } from "../db";

export function selectOrgUserById(user_id: string) {
  logger.debug("In selectOrgUserById() in org-user.model");
  logger.info(`Selecting user by Id: ${user_id}`);

  const queryStr = `SELECT * FROM org_user WHERE org_user.org_id = $1;`;

  return db.query(queryStr, [user_id]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      throw new Error("ORG_USER_NOT_FOUND");
    }

    return rows[0];
  });
}
