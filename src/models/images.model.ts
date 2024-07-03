import { logger } from "../logger";
import { db } from "../db";

export function selectImageById(imageId: number) {
  logger.debug(`In selectImageById() in images.model`);

  const queryStr = "SELECT * FROM images";

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
}
