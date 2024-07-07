import { Router } from "express";
import {
  getFavouriteListings,
  getFavouriteOrganisations,
  postFavouriteListings,
  deleteFavouriteListing,
} from "../controllers/favourites.controller";

export const favouritesRouter = Router();

favouritesRouter.route("/:user_id/orgs").get(getFavouriteOrganisations);

favouritesRouter
  .route("/:user_id/listings")
  .get(getFavouriteListings)
  .post(postFavouriteListings)
  .delete(deleteFavouriteListing);
