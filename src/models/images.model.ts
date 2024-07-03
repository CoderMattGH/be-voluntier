import { logger } from "../logger";
import { db } from "../db";
import * as imageValidator from "../validators/image.validator";

export function selectImageById(imageId: number) {
  logger.debug(`In selectImageById() in images.model`);

  const queryStr = "SELECT * FROM images WHERE img_id = $1;";

  return db.query(queryStr, [imageId]).then(({ rows }) => {
    return rows;
  });
}

export function createImage(b64ImgStr: string) {
  logger.debug(`In createImage() in images.model`);

  // Validate image
  const imgValObj = imageValidator.validateImage(b64ImgStr);
  if (!imgValObj.valid) {
    return Promise.reject({ status: 400, msg: imgValObj.msg });
  }

  const queryStr = "INSERT INTO images (img_b64_data) VALUES($1) RETURNING *;";

  return db.query(queryStr, [b64ImgStr]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 400,
        msg: "An unknown error occurred: unable to add image!",
      });
    }

    return rows[0];
  });
}
