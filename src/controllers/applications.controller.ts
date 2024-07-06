import { logger } from "../logger";
import { Request, Response, NextFunction, application } from "express";
import * as applicationsModel from "../models/applications.model";
import * as listingsModel from "../models/listings.model";
import { checkUserCredentials } from "../auth/auth-utils";
import * as volUserModel from "../models/vol-user.model";
import * as volUserBadgeModel from "../models/vol-user-badge.model";

export function getApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplication() in applications.controller`);

  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  applicationsModel
    .selectApplication(appIdNum.toString())
    .then((application) => {
      // Check if volunteer has access
      const volAuthObj = checkUserCredentials(
        req,
        application.vol_id,
        "volunteer"
      );

      // Check if organisation has access
      const orgAuthObj = checkUserCredentials(
        req,
        application.org_id,
        "organisation"
      );

      // If neither has authorisation, then reject
      if (!(orgAuthObj.authorised || volAuthObj.authorised)) {
        next(orgAuthObj.respObj);

        return;
      }

      res.status(200).send({ application: application });
    })
    .catch((err) => {
      next(err);
    });
}

export function getApplicationsByVolId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplicationsByVolId() in applications.controller`);

  const volIdNum = Number(req.params.vol_user_id);
  if (Number.isNaN(volIdNum)) {
    next({ status: 400, msg: "vol_user_id is not a number!" });

    return;
  }

  applicationsModel
    .selectApplicationsByVolId(volIdNum.toString())
    .then((applications) => {
      const volAuthObj = checkUserCredentials(req, volIdNum, "volunteer");

      if (!volAuthObj.authorised) {
        next(volAuthObj.respObj);

        return;
      }

      res.status(200).send({ applications: applications });
    })
    .catch((err) => {
      next(err);
    });
}

export function getApplicationsByOrgId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplicationsByOrgId() in applications.controller`);

  const orgIdNum = Number(req.params.org_user_id);
  if (Number.isNaN(orgIdNum)) {
    next({ status: 400, msg: "org_user_id is not a number!" });

    return;
  }

  let listingQuery;
  if (req.query.listing_id) listingQuery = req.query.listing_id.toString();

  logger.debug(
    `Searching for applications where listingQuery: ${listingQuery} ` +
      `orgIdNum: ${orgIdNum}`
  );

  applicationsModel
    .selectApplicationsByOrgId(orgIdNum.toString(), listingQuery)
    .then((applications) => {
      const orgAuthObj = checkUserCredentials(req, orgIdNum, "organisation");
      if (!orgAuthObj.authorised) {
        next(orgAuthObj.respObj);

        return;
      }

      res.status(200).send({ applications: applications });
    })
    .catch((err) => {
      next(err);
    });
}

export function getApplications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In getApplications() in applications.controller`);

  if (!req.query.list_id) {
    next({ status: 400, msg: "list_id is not set!" });

    return;
  }

  const listIdNum = Number(req.query.list_id);
  if (Number.isNaN(listIdNum)) {
    next({ status: 400, msg: "list_id is not a number!" });

    return;
  }

  // Check listing id exists
  const listingIdExistsProm = listingsModel.selectListing(
    true,
    listIdNum.toString()
  );

  return listingIdExistsProm
    .then(({ listing }) => {
      // Check organisation user owns the listing
      const orgAuthObj = checkUserCredentials(
        req,
        listing.list_org,
        "organisation"
      );

      if (!orgAuthObj.authorised) {
        return Promise.reject(orgAuthObj.respObj);
      }

      logger.debug(`Authorisation OK!`);

      return applicationsModel.selectApplicationsByListingId(listIdNum);
    })
    .then((applications) => {
      logger.info(
        `Successfully selected application listings for list_id: ${listIdNum}`
      );

      res.status(200).send({ applications });
    })
    .catch((err) => {
      next(err);
    });
}

// Volunteer user applies for listing
export function postApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In postApplication() in applications.controller`);

  // Validate listing_id is a number
  const listingIdNum = Number(req.body.listing_id);
  if (Number.isNaN(listingIdNum)) {
    next({ status: 400, msg: "listing_id is not a number!" });

    return;
  }

  // Validate vol_user_id is a number
  const volUserId = Number(req.body.vol_user_id);
  if (Number.isNaN(volUserId)) {
    next({ status: 400, msg: "vol_user_id is not a number!" });

    return;
  }

  // Authorise user
  const authObj = checkUserCredentials(req, volUserId, "volunteer");
  if (!authObj.authorised) {
    next(authObj.respObj);

    return;
  }

  applicationsModel
    .createApplication(volUserId, listingIdNum)
    .then((application) => {
      res.status(200).send({ application: application });
    })
    .catch((err) => {
      next(err);
    });
}

// Delete application
export function deleteApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In deleteApplication() in applications.controller`);

  // Validate app_id is a number
  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  const appPromise = applicationsModel.selectApplication(appIdNum.toString());

  appPromise
    .then((application) => {
      // Verify application is owned by user or org
      const volAuthObj = checkUserCredentials(
        req,
        application.vol_id,
        "volunteer"
      );

      const orgAuthObj = checkUserCredentials(
        req,
        application.org_id,
        "organisation"
      );

      if (!volAuthObj.authorised && !orgAuthObj.authorised) {
        return Promise.reject(volAuthObj.respObj);
      }

      return applicationsModel
        .deleteApplicationByAppId(appIdNum)
        .then((application) => {
          logger.debug("Application successfully deleted!");

          res.status(200).send({ application });
        });
    })
    .catch((err) => {
      next(err);

      return;
    });
}

export function patchApplicationConfirm(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In patchApplicationConfirm in applications.controller`);

  // Validate app_id is a number
  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  // Validate accept boolean
  const { accept: confirm } = req.body;
  if (confirm === undefined || typeof confirm !== "boolean") {
    next({ status: 400, msg: "accept must be a boolean!" });

    return;
  }

  const appPromise = applicationsModel.selectApplication(appIdNum.toString());

  appPromise
    .then((application) => {
      // Validate that organisation user owns application listing
      const orgAuthObj = checkUserCredentials(
        req,
        application.org_id,
        "organisation"
      );

      if (!orgAuthObj.authorised) {
        return Promise.reject(orgAuthObj.respObj);
      }

      logger.debug(
        `Authorised organisation user with org_id ${application.org_id} with app_id: ${appIdNum}`
      );

      // If application has already confirmed, then reject
      if (application.attended) {
        return Promise.reject({
          status: 400,
          msg: `Application has already been attended!`,
        });
      }

      return applicationsModel.updateApplicationConfirmById(appIdNum, confirm);
    })
    .then((application) => {
      res.status(200).send({ application });

      return;
    })
    .catch((err) => {
      next(err);
    });
}

// PATCH /api/applications/:app_id/confirm-attendance
// Confirms attendance of applicant and awards badges for hours
export function patchAppAttendance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In patchAppAttendance() in applications.controller`);

  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  applicationsModel
    .selectAppByIdWithListInfoAndUserInfo(appIdNum)
    .then((application) => {
      if (!application) {
        return Promise.reject({ status: 404, msg: "Application not found!" });
      }

      // TODO:
      // // Check org_user owns the application
      // const orgAuthObj = checkUserCredentials(
      //   req,
      //   application.org_id,
      //   "organisation"
      // );
      // if (!orgAuthObj.authorised) {
      //   return Promise.reject(orgAuthObj.respObj);
      // }

      // Check application has been confirmed.
      if (!application.confirm) {
        return Promise.reject({
          status: 400,
          msg: "Application has not yet been confirmed!",
        });
      }

      // Check application attendance has not already been confirmed!
      if (application.attended) {
        return Promise.reject({
          status: 400,
          msg: "Application attendance has already been confirmed!",
        });
      }

      const hours = application.list_duration;
      const volUserId = application.vol_id;
      const volUserHours = application.vol_hours;

      logger.info(
        `Confirming application attendance where application: ${appIdNum} ` +
          `vol_id: ${volUserId} vol_user_hours: ${volUserHours} app_duration: ${hours}`
      );

      const newVolUserHours = volUserHours + hours;

      // Update hours on vol_user
      logger.debug(
        `Updating volunteer user hours where vol_user_id: ${volUserId} ` +
          `vol_user_hours: ${newVolUserHours}`
      );
      return volUserModel.updateVolUserHours(volUserId, newVolUserHours);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 500,
          msg: "Could not update volunteer user!",
        });
      }

      logger.debug(
        `Successfully updated volunteer user hours where vol_user_id: ${user.vol_id}!`
      );

      // TODO: FIGURE OUT WHICH BADGE TO ADD

      // Add badges
      logger.debug(
        `Adding badges to vol_user_badge_junc table where vol_user_id: ${user.vol_id}`
      );
      return volUserBadgeModel.createVolUserBadge(user.vol_id, 8);
    })
    .then((badgeInfo) => {
      if (!badgeInfo) {
        return Promise.reject({
          status: 404,
          msg: "Could not update volunteer badges!",
        });
      }

      logger.debug(`Successfully added badges to vol_user_badge_junc table!`);

      // Finally update appplication attendance status
      logger.debug(`Updating application attendance where app_id: ${appIdNum}`);
      return applicationsModel.updateAppAttendance(appIdNum);
    })
    .then((application) => {
      logger.info(
        `Application attendance successfully confirmed where app_id: ${appIdNum}!`
      );

      res.status(200).send({ application });
    })
    .catch((err) => {
      next(err);
    });
}
