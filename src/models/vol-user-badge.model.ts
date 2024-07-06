import { logger } from "../logger";
import { db } from "../db";
import format from "pg-format";

export function createVolUserBadges(volUserId: number, badgeIds: number[]) {
  logger.debug(`In createUserBadge() in vol-user-badge.model`);
  logger.info(
    `Adding badges where badge_ids: [${badgeIds}] to vol_user: ${volUserId} if not extant`
  );

  const queryStr = format(
    `INSERT INTO vol_user_badge_junc (vol_id, badge_id)
    VALUES %L ON CONFLICT (vol_id, badge_id) DO NOTHING RETURNING *;`,
    badgeIds.map((badgeId) => {
      return [volUserId, badgeId];
    })
  );

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
}
