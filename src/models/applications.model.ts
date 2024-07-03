import { logger } from "../logger";
import { db } from "../db";

export function selectApplication(appIdNum: string) {
  logger.debug(`In selectApplication() in applications.model`);

  let queryStr = `
  SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf, list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_description, list_img, org_users.org_name 
  FROM applications 
  JOIN listings ON applications.listing_id = listings.list_id
  JOIN org_users ON listings.list_org = org_users.org_id
  WHERE applications.app_id = $1
  `;

  return db.query(queryStr, [appIdNum]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No application found!" });
    }

    return rows[0];
  });
}

export function selectApplicationsByVolId(volIdNum: string) {
  logger.debug(`In selectApplicationsByVolId() in applications.model`);

  let queryStr = `
  SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf, list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_description, list_img, org_users.org_name
  FROM applications 
  JOIN listings ON applications.listing_id = listings.list_id
  JOIN org_users ON org_users.org_id = listings.list_org
  WHERE applications.vol_id = $1
  `;

  return db.query(queryStr, [volIdNum]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No applications found!" });
    }

    return rows;
  });
}
