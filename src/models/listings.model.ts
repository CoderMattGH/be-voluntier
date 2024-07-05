import { logger } from "../logger";
import { db } from "../db";
import { createImage } from "./images.model";

// TODO: Implement better search
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
        list_time, list_duration, list_description, list_img_id, list_org, org_users.org_name,
        org_users.org_avatar_img_id
        FROM listings 
        JOIN org_users on listings.list_org = org_users.org_id 
        WHERE listings.list_visible = $1 `;

  queryStr += `AND (listings.list_title ILIKE $2 OR listings.list_description ILIKE $2) `;

  queryStr += `ORDER BY list_${sortBy} `;

  queryStr += `${order.toUpperCase()} `;

  queryStr += `, listings.list_id ASC`;

  return db.query(queryStr, [visible, `%${search}%`]).then(({ rows }) => {
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
  list_date: string; // Use appropriate type if it's a Date object
  list_time: string; // Use appropriate type if it's a Date object
  list_duration: string; // Use appropriate type (e.g., number) depending on your requirements
  list_description: string;
  list_latitude: number;
  list_longitude: number;
  img_b64_data: string; // Base64 image data
  list_skills: string[];
  list_visible: boolean;
}

export function createListing(body: ListingBody, id: number) {
  logger.debug(`In createListing() in listings.model`);

  const title = body.list_title;
  const location = body.list_location;
  const date = body.list_date;
  const time = body.list_time;
  const duration = body.list_duration;
  const description = body.list_description;
  const latitude = body.list_latitude;
  const longitude = body.list_longitude;
  const imgB64Data = body.img_b64_data;
  const isVisible = body.list_visible;

  let imgId: number | null = null;

  const createListingWithImage = async () => {
    try {
      // Step 1: Create image using images.model.createImage

      if (imgB64Data && imgB64Data.trim().length > 0) {
        const imageResult = await createImage(imgB64Data);
        imgId = imageResult.img_id;
      }

      // Step 2: Create listing with image_id
      const queryStrListing = `
        INSERT INTO listings (list_title, list_location, list_longitude, list_latitude, list_date, list_time, list_duration, list_description, list_org, list_img_id, list_visible)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        title,
        location,
        longitude,
        latitude,
        date,
        time,
        duration,
        description,
        id,
        imgId,
        isVisible,
      ];

      const { rows: listingRows } = await db.query(queryStrListing, values);

      return listingRows[0];
    } catch (err: any) {
      throw new Error(err);
    }
  };

  return createListingWithImage();
}

export async function createListingSkillJunc(
  listId: number,
  list_skills: string[]
) {
  try {
    const queryStr = `
      INSERT INTO list_skill_junc (list_id, skill_id)
      SELECT $1, skill_id FROM skills WHERE skill_name = $2
    `;

    const queries = list_skills.map(async (skillName) => {
      await db.query(queryStr, [listId, skillName]);
    });

    await Promise.all(queries);
  } catch (err: any) {
    throw new Error(err);
  }
}
