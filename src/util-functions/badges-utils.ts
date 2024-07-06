export function volHoursToBadgeIds(hours: number) {
  const badgeIds = [];

  const badgeMap = new Map();
  badgeMap.set(1, 1);
  badgeMap.set(10, 2);
  badgeMap.set(30, 3);
  badgeMap.set(50, 4);
  badgeMap.set(75, 5);
  badgeMap.set(100, 6);
  badgeMap.set(200, 7);

  for (const [badgeHours, badgeId] of badgeMap) {
    if (hours >= badgeHours) {
      badgeIds.push(badgeId);
    }
  }

  return badgeIds;
}
