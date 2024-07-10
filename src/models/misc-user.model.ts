import { logger } from "../logger";
import { db } from "../db";

export function doesUserAccountExist(email: string) {
  return db
    .query(
      "SELECT vol_email, org_email FROM vol_users, org_users WHERE vol_email = $1 OR org_email = $1;",
      [email]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
}
