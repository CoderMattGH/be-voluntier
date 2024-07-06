import { logger } from "../logger";
import { db } from "../db";

export function createVolUserBadge(volUserId: number, badgeId: number) {
  logger.debug(`In createUserBadge() in vol-user-badge.model`);
  logger.info(
    `Adding badge where badge_id:${badgeId} to vol_user: ${volUserId}`
  );

  const queryStr = `INSERT INTO vol_user_badge_junc (vol_id, badge_id) 
    VALUES($1, $2) RETURNING *;`;

  return db.query(queryStr, [volUserId, badgeId]).then(({ rows }) => {
    if (!rows.length) {
      return null;
    }

    return rows[0];
  });
}
