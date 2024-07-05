import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as listingsModel from "../models/listings.model";
import { getUserInfoFromToken } from "../auth/auth-utils";

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
    sortBy = req.query.sort_by.toString();
  }

  // Set order
  let order;
  if (req.query.order) {
    order = req.query.order.toString();
  }

  // Set search
  let search;
  if (req.query.search) {
    search = req.query.search.toString();
  }

  listingsModel
    .selectListings(visible, sortBy, order, search)
    .then((listings) => {
      if (!listings.length) {
        next({ status: 404, msg: "No listings found!" });

        return;
      }

      res.status(200).send({ listings });
    })
    .catch((err) => {
      next(err);
    });
}

export function getListing(req: Request, res: Response, next: NextFunction) {
  const { listing_id } = req.params;
  logger.debug(`In getListing() in listings.controller`);

  let visible = true;
  if (req.query.visible && req.query.visible === "false") visible = false;

  listingsModel
    .selectListing(visible, listing_id)
    .then((listing) => {
      res.status(200).send(listing);
    })
    .catch((err) => {
      next(err);
    });
}

export function postListing(req: Request, res: Response, next: NextFunction) {
  logger.debug(`In postListing() in listings.controller`);

  interface SessionUser {
    id: number;
    role: string;
  }

  const body = req.body;

  const orgObj = getUserInfoFromToken(req);
  if (!orgObj) {
    next({ status: 401, msg: "User must be logged in as organisation!" });

    return;
  }

  listingsModel
    .createListing(body, orgObj.id)
    .then((newListing) => {
      if (body.skills && body.skills.length > 0) {
        return listingsModel
          .createListingSkillJunc(newListing.list_id, body.skills)
          .then(() => newListing);
      }

      return newListing;
    })
    .then((newListing) => {
      res.status(201).send({ newListing });
    })
    .catch((err) => {
      next(err);
    });
}
