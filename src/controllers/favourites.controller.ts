import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import { checkUserCredentials } from "../auth/auth-utils";
import * as favouritesModel from "../models/favourites.model";
import * as listingsModel from "../models/listings.model";

export function getFavouriteOrganisations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getFavouriteOrganisations() in favourites.controller`);

  const userIdNum = Number(req.params.user_id);
  if (Number.isNaN(userIdNum)) {
    next({ status: 400, msg: "user_id is not a number!" });

    return;
  }

  // Check authorisation
  const favAuthObj = checkUserCredentials(req, userIdNum, "volunteer");
  if (!favAuthObj.authorised) {
    next(favAuthObj.respObj);

    return;
  }

  return favouritesModel
    .selectFavOrganisationsByUserId(userIdNum)
    .then((favourites) => {
      if (!favourites.length) {
        res.status(404).send({ status: 404, msg: "No favourites found!" });

        return;
      }

      res.status(200).send({ favourite_orgs: favourites });
    })
    .catch((err) => {
      next(err);
    });
}

export function getFavouriteListings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getFavouriteListings() in favourites.controller`);

  const userIdNum = Number(req.params.user_id);
  if (Number.isNaN(userIdNum)) {
    next({ status: 400, msg: "user_id is not a number!" });

    return;
  }

  // Check authorisation
  const favAuthObj = checkUserCredentials(req, userIdNum, "volunteer");
  if (!favAuthObj.authorised) {
    next(favAuthObj.respObj);

    return;
  }

  return favouritesModel
    .selectFavListingsByUserId(userIdNum)
    .then((favourites) => {
      if (!favourites.length) {
        res.status(404).send({ status: 404, msg: "No favourites found!" });

        return;
      }

      res.status(200).send({ favourite_listings: favourites });
    })
    .catch((err) => {
      next(err);
    });
}

export function postFavouriteListings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In postFavouriteListings() in favourites.controller`);

  const listIdNum = Number(req.body.list_id);

  if (Number.isNaN(listIdNum)) {
    next({ status: 400, msg: "list_id is not a number!" });
    return;
  }

  const userIdNum = Number(req.params.user_id);
  if (Number.isNaN(userIdNum)) {
    next({ status: 400, msg: "user_id is not a number!" });
    return;
  }

  // Check authorisation
  const favAuthObj = checkUserCredentials(req, userIdNum, "volunteer");
  if (!favAuthObj.authorised) {
    next(favAuthObj.respObj);

    return;
  }

  // Check listing exists
  const listingExistsPromise = listingsModel.selectListing(
    true,
    listIdNum.toString()
  );

  return listingExistsPromise
    .then(() => {
      logger.info(`Listing with listing_id:${listIdNum} found!`);

      return favouritesModel.postFavouriteToListing(userIdNum, listIdNum);
    })
    .then((favourite) => {
      res.status(201).send({ favourite });
    })
    .catch((err) => {
      next(err);
    });
}
