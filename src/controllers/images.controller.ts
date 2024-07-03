import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as imagesModel from "../models/images.model";

export function getImage(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In getImage() in images.controller`);

  // Validate image id
  const imgId = Number(req.params.img_id);
  if (!Number.isNaN(imgId)) {
    next({ status: 400, msg: "img_id is not a number!" });

    return;
  }

  imagesModel.selectImageById(imgId).then((images) => {
    if (!images.length) {
      return { status: 404, msg: "No image found!" };
    }

    res.status(200).send({ image: images[0] });
  });
}
