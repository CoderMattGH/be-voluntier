import { logger } from "../logger";
import { db } from "../db";

export function selectApplicationsByVolId(user_id: string) {
  logger.debug(`In selectApplicationsByVolId() in applications.model`);

  let queryStr = `
  SELECT * FROM applications
  WHERE applications.app_id = $1
  `;

  return db.query(queryStr, [user_id]).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No applications found!" });
    }

    return { applications: rows };
  });
}
