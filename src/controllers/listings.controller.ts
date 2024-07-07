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

  const { body: listing } = req;

  // Non nullable values
  const valMap = new Map();
  valMap.set("list_title", { val: listing.list_title, type: "string" });
  valMap.set("list_location", { val: listing.list_location, type: "string" });
  valMap.set("list_date", { val: listing.list_date, type: "string" });
  valMap.set("list_time", { val: listing.list_time, type: "string" });
  valMap.set("list_duration", { val: listing.list_duration, type: "number" });
  valMap.set("list_description", {
    val: listing.list_description,
    type: "string",
  });
  valMap.set("list_latitude", { val: listing.list_latitude, type: "number" });
  valMap.set("list_longitude", { val: listing.list_longitude, type: "number" });

  for (const [key, value] of valMap.entries()) {
    if (value.val === undefined || value.val === null) {
      next({ status: 400, msg: `${key} is not a ${value.type}!` });

      return;
    }

    if (typeof value.val !== value.type) {
      next({ status: 400, msg: `${key} is not a ${value.type}!` });

      return;
    }
  }

  // Nullable values
  if (listing.img_b64_data) {
    if (typeof listing.img_b64_data !== "string") {
      next({ status: 400, msg: `img_b64_data is not a string!` });

      return;
    }
  }

  if (listing.list_skills) {
    if (!Array.isArray(listing.list_skills)) {
      next({ status: 400, msg: `list_skills is not an array!` });

      return;
    }
  }

  if (listing.list_visible !== undefined) {
    if (typeof listing.list_visble !== "boolean") {
      next({ status: 400, msg: `list_visible is not a boolean!` });

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
    .then((listing) => {
      res.status(201).send({ listing });
    })
    .catch((err) => {
      next(err);
    });
}
