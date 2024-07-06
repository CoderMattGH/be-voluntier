export function isEmptyString(str: string) {
  if (!str.trim().length) {
    return true;
  }

  return false;
}

export function startsEndsWSpaces(str: string) {
  if (str.trim().length !== str.length) {
    return true;
  }

  return false;
}
