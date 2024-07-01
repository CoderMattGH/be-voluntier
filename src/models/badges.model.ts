import { logger } from "../logger";
import { db } from "../db";

export function selectBadges(user_id: string) {
  logger.debug(`In selectBadges() in badges.model`);

  let queryStr = `SELECT * FROM badges
  JOIN vol_user_badge_junc ON badges.badge_id = vol_user_badge_junc.badge_id
  JOIN vol_users ON vol_user_badge_junc.vol_id = vol_users.vol_id
  WHERE vol_users.vol_id = $1;
  `;

  return db.query(queryStr, [user_id]).then(({ rows }) => {
    console.log(rows);

    if (!rows) {
      return Promise.reject({ status: 404, msg: "No badges found!" });
    }

    return { badges: rows };
  });
}
