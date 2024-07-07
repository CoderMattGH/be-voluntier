import { logger } from "../logger";
import { db } from "../db";

export function selectFavOrganisationsByUserId(userId: number) {
  logger.debug(`In selectFavOrganisationsByUserId() in favourites.model`);
  logger.info(`Selecting favourite organisations for user_id: ${userId}`);

  const queryStr = `SELECT fav_orgs_id, vol_id, favourite_orgs.org_id, org_users.org_name, 
    org_users.org_avatar_img_id
    FROM favourite_orgs
    JOIN org_users ON favourite_orgs.org_id = org_users.org_id 
    WHERE vol_id = $1;`;

  return db.query(queryStr, [userId]).then(({ rows }) => {
    return rows;
  });
}

export function selectFavListingsByUserId(userId: number) {
  logger.debug(`In selectFavListingsByUserId() in favourites.model`);
  logger.info(`Selecting favourite listings for user_id: ${userId}`);

  const queryStr = `SELECT fav_lists_id, vol_id, favourite_listings.list_id, listings.list_title,
    listings.list_description, listings.list_img_id  
    FROM favourite_listings 
    JOIN listings ON favourite_listings.list_id = listings.list_id
    WHERE vol_id = $1;`;

  return db.query(queryStr, [userId]).then(({ rows }) => {
    return rows;
  });
}

export function postFavouriteToListing(userIdNum: number, listIdNum: number) {
  logger.debug(`In postFavouriteToListing() in favourites.model`);

  return db
    .query(
      `INSERT INTO favourite_listings (vol_id, list_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userIdNum, listIdNum]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 400,
          msg: "An unknown error occurred!",
        });
      }

      return rows[0];
    });
}
