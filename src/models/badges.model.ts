import { logger } from "../logger";
import { db } from "../db";

export function selectBadges(user_id: string) {
  logger.debug(`In selectBadges() in badges.model`);

  let queryStr = `
  SELECT * FROM badges
  JOIN volUserBadgeJuncs ON badges.badge_id = volUserBadgeJuncs.badge_id
  JOIN volUsers ON volUserBadgeJuncs.vol_id = volUsers.vol_id
  WHERE volUsers.vol_id = $1
  `;

  return db.query(queryStr, [user_id]).then(({ rows }) => {
    console.log(rows);

    if (!rows) {
      return Promise.reject({ status: 404, msg: "No badges found!" });
    }

    return { badges: rows };
  });
}
