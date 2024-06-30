import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as listingsModel from '../models/listings.model';

export function getListings(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In getListings() in listings.controller`);
  
  console.log(req.query);

  let visible = true;
  if (req.query.visible && req.query.visible === "false")
    visible = false;
  

  listingsModel.selectListings(visible)
      .then((articles) => {
        res.status(200).send(articles);
      })
      .catch((err) => {
        next(err);
      });
}

export function getListing() {}

export function postListing() {}
