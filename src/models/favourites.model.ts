import { logger } from "../logger";
import { db } from "../db";

// TODO: Do joins to get organisations name
export function selectFavOrganisationsByUserId(userId: number) {
  logger.debug(`In selectFavOrganisationsByUserId() in favourites.model`);
  logger.info(`Selecting favourite organisations for user_id: ${userId}`);

  const queryStr = `SELECT fav_orgs_id, vol_id, favourite_orgs.org_id, org_users.org_name, 
  org_users.org_avatar 
  FROM favourite_orgs 
  JOIN org_users ON favourite_orgs.org_id = org_users.org_id 
  WHERE vol_id = $1;`;

  return db.query(queryStr, [userId]).then(({ rows }) => {
    return rows;
  });
}

// TODO: Do joins to get listings name
export function selectFavListingsByUserId(userId: number) {
  logger.debug(`In selectFavListingsByUserId() in favourites.model`);
  logger.info(`Selecting favourite listings for user_id: ${userId}`);

  const queryStr = `SELECT fav_lists_id, vol_id, favourite_listings.list_id, listings.list_title,
  listings.list_description, listings.list_img  
  FROM favourite_listings 
  JOIN listings ON favourite_listings.list_id = listings.list_id
  WHERE vol_id = $1;`;

  return db.query(queryStr, [userId]).then(({ rows }) => {
    return rows;
  });
}
