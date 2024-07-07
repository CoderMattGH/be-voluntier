import { logger } from "../logger";
import { db } from "../db";
import { volHoursToBadgeIds } from "../util-functions/badges-utils";
import * as volUserModel from "../models/vol-user.model";
import * as volUserBadgeModel from "../models/vol-user-badge.model";
import * as listingsModel from "../models/listings.model";

export function selectApplication(appIdNum: string) {
  logger.debug(`In selectApplication() in applications.model`);

  let queryStr = `SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, attended, confirm, 
    list_title, list_location, list_longitude, list_latitude, list_date, list_time, 
    list_description, list_img_id, org_users.org_name 
    FROM applications 
    JOIN listings ON applications.listing_id = listings.list_id
    JOIN org_users ON listings.list_org = org_users.org_id
    WHERE applications.app_id = $1;`;

  return db.query(queryStr, [appIdNum]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No application found!" });
    }

    return rows[0];
  });
}

export function selectApplicationsByVolId(volIdNum: string) {
  logger.debug(`In selectApplicationsByVolId() in applications.model`);

  let queryStr = `SELECT app_id, vol_id, listings.list_org AS org_id, listing_id, attended, confirm, 
    list_title, list_location, list_longitude, list_latitude, list_date, list_time, 
    list_description, list_img_id, org_users.org_name
    FROM applications 
    JOIN listings ON applications.listing_id = listings.list_id
    JOIN org_users ON org_users.org_id = listings.list_org
    WHERE applications.vol_id = $1;`;

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

  let queryStr = `SELECT app_id, applications.vol_id, listings.list_org AS org_id, listing_id, confirm, 
    attended, list_title, list_location, list_longitude, list_latitude, list_date, list_time, 
    list_description, list_img_id, vol_users.vol_first_name, vol_users.vol_last_name, 
    vol_users.vol_email, vol_users.vol_contact_tel, vol_users.vol_avatar_img_id
    FROM applications
    JOIN listings ON applications.listing_id = listings.list_id
    JOIN vol_users ON vol_users.vol_id = applications.vol_id
    WHERE listings.list_org = $1`;

  const params = [orgIdNum];

  if (listingQuery.length > 0) {
    queryStr += " AND applications.listing_id = $2;";
    params.push(listingQuery);
  }

  return db.query(queryStr, params).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No applications found!" });
    }

    return rows;
  });
}

export function selectApplicationsByListingId(listId: number) {
  logger.info(`In selectApplicationsByListingId() in applications.model`);
  logger.debug(`Trying to fetch applications where listingId: ${listId}`);

  const queryStr = `SELECT app_id, applications.vol_id, listings.list_org AS org_id,
    listing_id, confirm, attended, list_title, list_location, list_date, list_time,
    list_img_id, vol_users.vol_email, vol_users.vol_contact_tel, vol_users.vol_avatar_img_id
    FROM applications 
    JOIN listings ON applications.listing_id = listings.list_id 
    JOIN vol_users ON vol_users.vol_id = applications.vol_id
    WHERE listing_id = $1;`;

  return db.query(queryStr, [listId]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No applications found!" });
    }

    return rows;
  });
}

export function createApplication(volId: number, listingId: number) {
  logger.info(`In createApplication() in applications.model`);
  logger.debug(
    `Trying to create application where volId: ${volId} and listingId: ${listingId}`
  );

  // Validate volId exists and check exists
  const volIdExistsProm = volUserModel.selectVolUserById(volId.toString());

  // Validate listingId and check exists
  const listIdProm = listingsModel.selectListing(true, listingId.toString());

  // Check application does not already exist
  const doesAppExistProm = doesAppExistWListIdAndVolId(volId, listingId);

  return volIdExistsProm
    .then(() => {
      return listIdProm;
    })
    .then(() => {
      logger.debug(`list_id and vol_id exist!`);
      return doesAppExistProm;
    })
    .then((doesAppExist) => {
      if (doesAppExist) {
        logger.info(`Application already exists!`);

        return Promise.reject({
          status: 400,
          msg: "Application already exists!",
        });
      }

      const queryStr = `INSERT INTO applications (vol_id, listing_id, confirm, attended) 
      VALUES($1, $2, false, false) RETURNING *;`;

      return db.query(queryStr, [volId, listingId]);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 400,
          msg: "An unknown error occurred!",
        });
      }

      logger.info(`Application successfully created!`);

      return rows[0];
    });
}

export function deleteApplicationByAppId(appId: number) {
  logger.info(`In deleteApplicationByAppId in applications.model`);
  logger.debug(`Trying to delete application where appId: ${appId}`);

  const queryStr = `DELETE FROM applications WHERE app_id = $1 RETURNING *;`;

  return db.query(queryStr, [appId]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 400,
        msg: "Application does not exist!",
      });
    }

    logger.info(`Application with app_id:${appId} successfully deleted!`);

    return rows[0];
  });
}

export function updateApplicationConfirmById(appId: number, confirm: boolean) {
  logger.info(`In updateApplicationConfirmById in applications.model`);
  logger.debug(`Trying to confirm application where appId: ${appId}`);

  const queryStr = `UPDATE applications SET confirm = $1 WHERE app_id = $2 RETURNING *;`;

  return db.query(queryStr, [confirm, appId]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Application not found!" });
    }

    logger.info(
      `Successfully confirmed application with app_id:${appId} confirm:${confirm}`
    );

    return rows[0];
  });
}

export function updateAppAttendance(appId: number) {
  logger.info(`In patchAppAttendance in applications.model`);
  logger.debug(`Confirming attendance where appId: ${appId}`);

  return selectAppByIdWithListInfoAndUserInfo(appId)
    .then((application) => {
      if (!application) {
        return Promise.reject({ status: 404, msg: "Application not found!" });
      }

      // Check application has been confirmed.
      if (!application.confirm) {
        return Promise.reject({
          status: 400,
          msg: "Application has not yet been confirmed!",
        });
      }

      // Check application attendance has not already been confirmed!
      if (application.attended) {
        return Promise.reject({
          status: 400,
          msg: "Application attendance has already been confirmed!",
        });
      }

      const hours = application.list_duration;
      const volUserId = application.vol_id;
      const volUserHours = application.vol_hours;
      const newVolUserHours = volUserHours + hours;

      logger.info(
        `Confirming application attendance where application: ${appId} ` +
          `vol_id: ${volUserId} vol_user_hours: ${volUserHours} app_duration: ${hours} ` +
          `new_vol_user_hours: ${newVolUserHours}`
      );

      // Update hours on vol_user
      return volUserModel.updateVolUserHours(volUserId, newVolUserHours);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 500,
          msg: "Could not update volunteer user!",
        });
      }

      logger.debug(
        `Successfully updated volunteer user hours where vol_user_id: ${user.vol_id}!`
      );

      const badgesToAward = volHoursToBadgeIds(user.vol_hours);

      logger.debug(
        `Adding badges to vol_user_badge_junc table where vol_user_id: ${user.vol_id}`
      );

      // Add badges
      return volUserBadgeModel.createVolUserBadges(user.vol_id, badgesToAward);
    })
    .then((insertedBadges) => {
      if (!insertedBadges.length) {
        logger.info(`No new badges awarded!`);
      } else {
        logger.info(`Successfully added badges to vol_user_badge_junc table!`);
      }

      // Finally update appplication attendance status
      const queryStr = `UPDATE applications SET attended = true WHERE app_id = $1 RETURNING *;`;

      return db.query(queryStr, [appId]);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Application not found!" });
      }

      logger.info(
        `Successfully updated attendance in application with app_id:${appId}`
      );

      return rows[0];
    });
}

export function selectAppByIdWithListInfoAndUserInfo(appId: number) {
  const queryStr = `SELECT applications.vol_id, applications.listing_id, applications.confirm,
    applications.attended, listings.list_duration, vol_users.vol_hours, 
    listings.list_org AS org_id 
    FROM applications 
    JOIN listings ON applications.listing_id = listings.list_id 
    JOIN vol_users ON applications.vol_id = vol_users.vol_id 
    WHERE applications.app_id = $1;`;

  return db.query(queryStr, [appId]).then(({ rows }) => {
    if (!rows.length) {
      return null;
    }

    return rows[0];
  });
}

function doesAppExistWListIdAndVolId(volId: number, listId: number) {
  const queryStr = `SELECT app_id FROM applications WHERE vol_id = $1 AND listing_id = $2;`;

  return db.query(queryStr, [volId, listId]).then(({ rows }) => {
    if (!rows.length) {
      return false;
    } else {
      return true;
    }
  });
}
