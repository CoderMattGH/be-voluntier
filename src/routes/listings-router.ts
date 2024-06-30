import { Router } from "express";
import {
  getListings,
  postListing,
  getListing,
} from "../controllers/listings.controller";

export const listingsRouter = Router();

listingsRouter.route("/").get(getListings).get(getListing).post(postListing);
