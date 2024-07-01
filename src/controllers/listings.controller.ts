import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as listingsModel from '../models/listings.model';

export function getListings(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In getListings() in listings.controller`);
  
  // Set visible query
  let visible;
  if (req.query.visible && req.query.visible === "false") {
    visible = false;
  }
  
  // Set sort by
  let sortBy;
  if (req.query.sort_by) {
    sortBy = (req.query.sort_by).toString();
  }

  // Set order
  let order;
  if (req.query.order) {
    order = (req.query.order).toString();
  }

  listingsModel.selectListings(visible, sortBy, order)
      .then((listings) => {
        res.status(200).send(listings);
      })
      .catch((err) => {
        next(err);
      });
}

export function getListing() {}

export function postListing() {}
