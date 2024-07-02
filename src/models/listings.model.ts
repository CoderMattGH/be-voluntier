import { logger } from "../logger";
import { db } from "../db";

export function selectListings(
  visible = true,
  sortBy = "date",
  order = "asc",
  search = ""
) {
  logger.debug(`In selectListings() in listings.model`);

  sortBy = sortBy.toLowerCase().trim();
  order = order.toLowerCase().trim();
  search = search.trim();

  // Validate sort_by query
  const sortByOptions = ["date", "duration"];
  if (!sortByOptions.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query!" });
  }

  // Validate order query
  const orderOptions = ["asc", "desc"];
  if (!orderOptions.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query!" });
  }

  let queryStr = `SELECT list_id, list_title, list_location, list_longitude, list_latitude, list_date,
        list_time, list_duration, list_description, list_img, list_org, org_users.org_name,
        org_users.org_avatar 
        FROM listings 
        JOIN org_users on listings.list_org = org_users.org_id 
        WHERE listings.list_visible = $1 `;

  queryStr += `AND (listings.list_title ILIKE $2 OR listings.list_description ILIKE $2) `;

  queryStr += `ORDER BY list_${sortBy} `;

  queryStr += `${order.toUpperCase()} `;

  queryStr += `, listings.list_id ASC`;

  return db.query(queryStr, [visible, `%${search}%`]).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No listings found!" });
    }

    return { listings: rows };
  });
}

export function selectListing(visible = true, listing_id: string) {
  logger.debug(`In selectListing() in listings.model`);

  let queryStr = `SELECT list_id, list_title, list_location, list_longitude, list_latitude, list_date,
        list_time, list_duration, list_description, list_img, list_org, org_users.org_name, 
        org_users.org_avatar 
        FROM listings 
        JOIN org_users on listings.list_org = org_users.org_id 
        WHERE listings.list_visible = $1
        AND listings.list_id = $2;`;

  return db.query(queryStr, [visible, listing_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No listing found!" });
    }

    return { listing: rows[0] };
  });
}
