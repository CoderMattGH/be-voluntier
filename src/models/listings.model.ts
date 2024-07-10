import { logger } from "../logger";
import { db } from "../db";
import { createImage } from "./images.model";
import * as postListingValidator from "../validators/post-listing.validator";
import * as imageValidator from "../validators/image.validator";

// TODO: Implement better search
export function selectListings(
  visible = true,
  sortBy = "date",
  order = "asc",
  search = "",
  orgId?: number
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
    list_time, list_duration, list_description, list_img_id, list_org, org_users.org_name,
    org_users.org_avatar_img_id
    FROM listings 
    JOIN org_users on listings.list_org = org_users.org_id 
    WHERE listings.list_visible = $1 `;

  queryStr += `AND (listings.list_title ILIKE $2 OR listings.list_description ILIKE $2) `;

  const queryParams = [visible, `%${search}%`];

  if (orgId) {
    queryStr += `AND listings.list_org = $3 `;
    queryParams.push(orgId.toString());
  }

  queryStr += `ORDER BY list_${sortBy} `;

  queryStr += `${order.toUpperCase()} `;

  queryStr += `, listings.list_id ASC`;

  return db.query(queryStr, queryParams).then(({ rows }) => {
    return rows;
  });
}

export function selectListing(visible = true, listing_id: string) {
  logger.debug(`In selectListing() in listings.model`);

  let queryStr = `SELECT list_id, list_title, list_location, list_longitude, list_latitude, list_date,
    list_time, list_duration, list_description, list_img_id, list_org, org_users.org_name, 
    org_users.org_avatar_img_id
    FROM listings 
    JOIN org_users on listings.list_org = org_users.org_id 
    WHERE listings.list_visible = $1
    AND listings.list_id = $2;`;

  return db.query(queryStr, [visible, listing_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No listing found!" });
    }

    return { listing: rows[0] };
  });
}

interface ListingBody {
  list_title: string;
  list_location: string;
  list_date: string;
  list_time: string;
  list_duration: number;
  list_description: string;
  list_latitude: number;
  list_longitude: number;
  img_b64_data: string;
  list_skills: string[] | null;
  list_visible: boolean | null;
}

export function createListing(listing: ListingBody, orgId: number) {
  logger.debug(`In createListing() in listings.model`);

  const title = listing.list_title;
  const location = listing.list_location;
  const date = listing.list_date;
  const time = listing.list_time;
  const duration = listing.list_duration;
  const description = listing.list_description;
  const latitude = listing.list_latitude;
  const longitude = listing.list_longitude;
  let skills = listing.list_skills;
  let imgB64Data = listing.img_b64_data;
  let visible = listing.list_visible;

  const titleValObj = postListingValidator.validateTitle(title);
  if (!titleValObj.valid) {
    return Promise.reject({ status: 400, msg: titleValObj.msg });
  }

  const locValObj = postListingValidator.validateLocation(location);
  if (!locValObj.valid) {
    return Promise.reject({ status: 400, msg: locValObj.msg });
  }

  const dateValObj = postListingValidator.validateDate(date);
  if (!dateValObj.valid) {
    return Promise.reject({ status: 400, msg: dateValObj.msg });
  }

  const timeValObj = postListingValidator.validateTime(time);
  if (!timeValObj.valid) {
    return Promise.reject({ status: 400, msg: timeValObj.msg });
  }

  const durValObj = postListingValidator.validateDuration(duration);
  if (!durValObj.valid) {
    return Promise.reject({ status: 400, msg: durValObj.msg });
  }

  const descValObj = postListingValidator.validateDescription(description);
  if (!descValObj.valid) {
    return Promise.reject({ status: 400, msg: descValObj.msg });
  }

  const longValObj = postListingValidator.validateLongLat(longitude);
  if (!longValObj.valid) {
    return Promise.reject({ status: 400, msg: longValObj.msg });
  }

  const latValObj = postListingValidator.validateLongLat(latitude);
  if (!latValObj.valid) {
    return Promise.reject({ status: 400, msg: latValObj.msg });
  }

  // TODO: nullable
  if (skills && skills !== null) {
    const skillsValObj = postListingValidator.validateSkills(skills);
    if (!skillsValObj.valid) {
      return Promise.reject({ status: 400, msg: skillsValObj.msg });
    }
  } else {
    skills = null;
  }

  // Nullable
  if (visible) {
    const visValObj = postListingValidator.validateVisibility(visible);
    if (!visValObj.valid) {
      return Promise.reject({ status: 400, msg: visValObj.msg });
    }
  } else {
    visible = null;
  }

  // Create image if sent image data
  let createImagePromise;
  if (imgB64Data) {
    const imgValObj = imageValidator.validateImage(imgB64Data);
    if (!imgValObj.valid) {
      return Promise.reject({ status: 400, msg: imgValObj.msg });
    }

    createImagePromise = createImage(imgB64Data);
  } else {
    createImagePromise = Promise.resolve(null);
  }

  return createImagePromise
    .then((img) => {
      if (img) {
        logger.debug(`Image successfully created with img_id: ${img.img_id}!`);
      } else {
        logger.debug(`Skipping image creation!`);
      }

      const queryStr = `INSERT INTO listings (list_title, list_location, list_longitude, 
        list_latitude, list_date, list_time, list_duration, list_description, list_org, 
        list_img_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;`;

      const values = [
        title,
        location,
        longitude,
        latitude,
        date,
        time,
        duration,
        description,
        orgId,
        img ? img.img_id : null,
      ];

      return db.query(queryStr, values);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 500,
          msg: "Unknown error creating listing!",
        });
      }

      const newListing = rows[0];

      // Add skills to list_skill_junc table if set
      let addSkillsProm;
      if (skills) {
        addSkillsProm = createListingSkillJunc(newListing.list_id, skills);
      } else {
        addSkillsProm = Promise.resolve(null);
      }

      return addSkillsProm.then(() => {
        logger.info("Successfully inserted listing!");

        return newListing;
      });
    })
    .catch((err) => {
      return err;
    });
}

export async function createListingSkillJunc(
  listId: number,
  list_skills: string[]
) {
  const queryStr = `INSERT INTO list_skill_junc (list_id, skill_id)
    SELECT $1, skill_id FROM skills WHERE skill_name ILIKE $2 RETURNING *;`;

  const queries = list_skills.map(async (skillName) => {
    await db.query(queryStr, [listId, skillName]);
  });

  return Promise.all(queries);
}
