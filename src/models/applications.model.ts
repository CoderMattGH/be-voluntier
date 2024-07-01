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

    return rows;
  });
}

export function selectApplication(app_id: string) {
  logger.debug(`In selectApplication() in applications.model`);

  let queryStr = `
  SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf 
  FROM applications 
  JOIN listings ON applications.listing_id = listings.list_id
  WHERE applications.app_id = $1
  `;

  return db.query(queryStr, [app_id]).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No application found!" });
    }

    return rows[0];
  });
}
