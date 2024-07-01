import { logger } from "../logger";
import { db } from "../db";

export function selectListings(visible = true) {
  logger.debug(`In selectListings() in listings.model`);

  let queryStr = `SELECT list_id, list_title, list_location, list_longitude, list_latitude, list_date,
        list_time, list_duration, list_description, list_img, org_users.org_name, 
        org_users.org_avatar 
        FROM listings 
        JOIN org_users on listings.list_org = org_users.org_id 
        WHERE listings.list_visible = $1;`;

  return db.query(queryStr, [visible]).then(({ rows }) => {
    console.log(rows);

    if (!rows) {
      return Promise.reject({ status: 404, msg: "No listings found!" });
    }

    return { articles: rows };
  });
}

export function selectListing(visible = true, listing_id: string) {
  logger.debug(`In selectListing() in listings.model`);

  let queryStr = `SELECT list_id, list_title, list_location, list_longitude, list_latitude, list_date,
        list_time, list_duration, list_description, list_img, org_users.org_name, 
        org_users.org_avatar 
        FROM listings 
        JOIN org_users on listings.list_org = org_users.org_id 
        WHERE listings.list_visible = $1
        AND listings.list_id = $2;`;

  return db.query(queryStr, [visible, listing_id]).then(({ rows }) => {
    console.log(rows);

    if (!rows) {
      return Promise.reject({ status: 404, msg: "No listing found!" });
    }

    return { listing: rows[0] };
  });
}
