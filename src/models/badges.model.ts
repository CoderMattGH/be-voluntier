import { logger } from "../logger";
import { db } from "../db";

export function selectBadges() {
  logger.debug(`In selectBadges() in badges.model`);

  const queryStr = `SELECT * FROM badges;`;

  return db.query(queryStr).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No badges found!" });
    }

    return rows;
  });
}

export function selectBadgesByUserId(user_id: string) {
  logger.debug(`In selectBadgesByUserId() in badges.model`);

  const queryStr = `SELECT badges.badge_id, badge_name, badge_img_path, badge_points, 
    vol_users.vol_id 
    FROM badges
    JOIN vol_user_badge_junc ON badges.badge_id = vol_user_badge_junc.badge_id
    JOIN vol_users ON vol_user_badge_junc.vol_id = vol_users.vol_id
    WHERE vol_users.vol_id = $1;`;

  return db.query(queryStr, [user_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No badges found!" });
    }

    return rows;
  });
}
