import { logger } from "../logger";
import { db } from "../db";

export function selectLeaderboard() {
  logger.debug(`In selectLeaderboard() in leaderboard.model`);

  let queryStr = `
  SELECT vol_users.vol_first_name,vol_users.vol_last_name,vol_users.vol_avatar,SUM(badges.badge_points) AS points FROM vol_users
  JOIN vol_user_badge_junc ON vol_user_badge_junc.vol_id = vol_users.vol_id
  JOIN badges ON badges.badge_id = vol_user_badge_junc.badge_id
  GROUP BY vol_users.vol_first_name,vol_users.vol_last_name,vol_users.vol_avatar
  ORDER BY points DESC
  LIMIT 10
  `;

  return db.query(queryStr).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({
        status: 404,
        msg: "No volunteers found when querying leaderboard!",
      });
    }

    return { leaderboard: rows };
  });
}
