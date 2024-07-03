import { logger } from "../logger";
import { db } from "../db";

export function selectApplication(appIdNum: string) {
  logger.debug(`In selectApplication() in applications.model`);

  let queryStr = `
  SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf, list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_description, list_img_id, org_users.org_name 
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
  SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf, list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_description, list_img_id, org_users.org_name
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

export function selectApplicationsByOrgId(
  orgIdNum: string,
  listingQuery: string = ""
) {
  logger.debug(`In selectApplicationsByOrgId() in applications.model`);

  if (listingQuery.length > 0) {
    const listingIdNum = Number(listingQuery);
    if (isNaN(listingIdNum)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid query for a listing id",
      });
    }
  }

  let queryStr = `
  SELECT app_id, applications.vol_id, listings.list_org AS org_id, listing_id, prov_confirm, full_conf, list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_description, list_img_id, vol_users.vol_first_name, vol_users.vol_last_name, vol_users.vol_email, vol_users.vol_contact_tel, vol_users.vol_avatar_img_id
  FROM applications
  JOIN listings ON applications.listing_id = listings.list_id
  JOIN vol_users ON vol_users.vol_id = applications.vol_id
  WHERE listings.list_org = $1
  `;

  const params = [orgIdNum];

  if (listingQuery.length > 0) {
    queryStr += " AND applications.listing_id = $2";
    params.push(listingQuery);
  }

  return db.query(queryStr, params).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No applications found!" });
    }

    return rows;
  });
}
