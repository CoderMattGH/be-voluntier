\c voluntier_db

SELECT vol_users.vol_first_name,vol_users.vol_last_name,vol_users.vol_avatar,SUM(badges.badge_points) AS points FROM vol_users
  JOIN vol_user_badge_junc ON vol_user_badge_junc.vol_id = vol_users.vol_id
  JOIN badges ON badges.badge_id = vol_user_badge_junc.badge_id
  GROUP BY vol_users.vol_first_name,vol_users.vol_last_name,vol_users.vol_avatar
  ORDER BY points DESC
  LIMIT 10