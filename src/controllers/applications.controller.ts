import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import * as applicationsModel from "../models/applications.model";
import * as listingsModel from "../models/listings.model";
import { checkUserCredentials } from "../auth/auth-utils";

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
  logger.debug(`In getApplicationsByListingId() in applications.controller`);

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

export function patchApplicationWithProvConfirm(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In patchApplicationWithProvConf in applications.controller`);

  // Validate app_id is a number
  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  // Validate accept boolean
  const { accept: acceptProv } = req.body;
  if (acceptProv === undefined || typeof acceptProv !== "boolean") {
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

      // If application has already been fully confirmed, then reject
      if (application.full_conf) {
        return Promise.reject({
          status: 400,
          msg: `Application has already been fully confirmed!`,
        });
      }

      return applicationsModel.updateApplicationProvConfirmById(
        appIdNum,
        acceptProv
      );
    })
    .then((application) => {
      res.status(200).send({ application });

      return;
    })
    .catch((err) => {
      next(err);
    });
}

export function patchApplicationWithFullConfirm(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`In patchApplicationWithFullConf in applications.controller`);

  // Validate app_id is a number
  const appIdNum = Number(req.params.app_id);
  if (Number.isNaN(appIdNum)) {
    next({ status: 400, msg: "app_id is not a number!" });

    return;
  }

  // Validate accept boolean
  const { confirm: confirmFull } = req.body;
  if (confirmFull === undefined || typeof confirmFull !== "boolean") {
    next({ status: 400, msg: "confirm must be a boolean!" });

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

      // If application has not yet been fully provisionally confirmed, then reject
      if (!application.prov_confirm) {
        return Promise.reject({
          status: 400,
          msg: `Application has not yet been provisionally confirmed!`,
        });
      }

      // If application has already been fully confirmed, then reject
      if (application.full_conf) {
        return Promise.reject({
          status: 400,
          msg: `Application has already been fully confirmed!`,
        });
      }

      return applicationsModel.updateApplicationFullConfirmById(
        appIdNum,
        confirmFull
      );
    })
    .then((application) => {
      res.status(200).send({ application });

      return;
    })
    .catch((err) => {
      next(err);
    });
}
