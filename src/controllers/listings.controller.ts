import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as listingsModel from "../models/listings.model";
import * as constants from "../constants";
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

  const body = req.body;

  const orgObj = getUserInfoFromToken(req);
  if (!orgObj) {
    next({ status: 401, msg: "User must be logged in as organisation!" });

    return;
  }

  if (orgObj.role !== "organisation") {
    next({ status: 403, msg: constants.ERR_MSG_PERMISSION_DENIED });
    return;
  }

  if (!req.body.list_title) {
    next({
      status: 400,
      msg: "list_title needs to be populated with characters!",
    });

    return;
  }

  if (!req.body.list_location) {
    next({
      status: 400,
      msg: "list_location needs to be populated with characters!",
    });

    return;
  }

  if (!req.body.list_date) {
    next({
      status: 400,
      msg: "list_date needs to be populated with characters!",
    });

    return;
  }

  if (!req.body.list_time) {
    next({
      status: 400,
      msg: "list_time needs to be populated with characters!",
    });

    return;
  }

  if (!req.body.list_duration) {
    next({
      status: 400,
      msg: "list_duration needs to be populated with characters!",
    });

    return;
  }

  if (!req.body.list_description) {
    next({
      status: 400,
      msg: "list_description needs to be populated with characters!",
    });

    return;
  }

  if (typeof req.body.list_latitude !== "number") {
    next({
      status: 400,
      msg: "list_latitude needs to be given!",
    });

    return;
  }

  if (typeof req.body.list_longitude !== "number") {
    next({
      status: 400,
      msg: "list_longitude needs to be given!",
    });

    return;
  }

  if (!Array.isArray(req.body.list_skills)) {
    next({
      status: 400,
      msg: "list_skills needs to be given!",
    });

    return;
  }

  for (const element of req.body.list_skills) {
    if (typeof element !== "string") {
      next({
        status: 400,
        msg: "list_skills must contain valid skills only!",
      });

      return;
    }
  }

  if (req.body.list_visible !== true) {
    next({
      status: 400,
      msg: "list_visible must be set to true!",
    });

    return;
  }

  listingsModel
    .createListing(body, orgObj.id)
    .then((newListing) => {
      if (body.list_skills && body.list_skills.length > 0) {
        return listingsModel
          .createListingSkillJunc(newListing.list_id, body.list_skills)
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
