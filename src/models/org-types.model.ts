import { logger } from "../logger";
import { db } from "../db";

export function selectOrgTypes() {
  logger.debug(`In selectOrgTypes() in org-types.model`);

  let queryStr = "SELECT type_title FROM org_types";

  return db.query(queryStr).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No org types found!" });
    }

    const orgTypesArr = rows.map((orgType) => orgType.type_title);

    return { orgTypes: orgTypesArr };
  });
}

export function selectOrgTypesWithId() {
  logger.debug(`In selectOrgTypesById()`);

  let queryStr = "SELECT * FROM org_types";

  return db.query(queryStr).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No org types found!" });
    }

    return { orgTypes: rows };
  });
}
