import { logger } from "../logger";
import { db } from "../db";

export function selectImageById(imageId: number) {
  logger.debug(`In selectImageById() in images.model`);

  const queryStr = "SELECT * FROM images WHERE img_id = $1;";

  return db.query(queryStr, [imageId]).then(({ rows }) => {
    return rows;
  });
}
