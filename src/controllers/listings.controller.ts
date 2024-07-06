import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { getUserInfoFromToken } from "../auth/auth-utils";
import * as listingsModel from "../models/listings.model";
import * as constants from "../constants";

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

  // Set org_id
  let orgId;
  if (req.query.org_id) {
    const orgIdNum = Number(req.query.org_id);
    if (Number.isNaN(orgIdNum)) {
      next({ status: 400, msg: "org_id must be a number!" });
    }

    orgId = orgIdNum;
  }

  listingsModel
    .selectListings(visible, sortBy, order, search, orgId)
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

  const { body: listing } = req.body;

  // Non nullable values
  const valMap = new Map();
  valMap.set("list_title", listing.list_title);
  valMap.set("list_location", listing.list_location);
  valMap.set("list_date", listing.list_date);
  valMap.set("list_time", listing.list_time);
  valMap.set("list_duration", listing.list_duration);
  valMap.set("list_description", listing.list_description);
  valMap.set("list_latitude", listing.list_latitude);
  valMap.set("list_longitude", listing.list_longitude);

  for (const [key, value] of valMap) {
    if (value === undefined || value === null) {
      next({ status: 400, msg: `${key} is not defined or null!` });

      return;
    }
  }

  const orgObj = getUserInfoFromToken(req);
  if (!orgObj) {
    next({ status: 401, msg: constants.ERR_MSG_NOT_LOGGED_IN });

    return;
  }

  if (orgObj.role !== "organisation") {
    next({ status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED });

    return;
  }

  listingsModel
    .createListing(listing, orgObj.id)
    .then((newListing) => {
      res.status(201).send(newListing);
    })
    .catch((err) => {
      next(err);
    });
}
