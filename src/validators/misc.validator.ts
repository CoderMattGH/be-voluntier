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

export function isNumber(number: any) {
  if (number === undefined || number === null) {
    return false;
  }

  let numberNum = Number(number);
  if (Number.isNaN(numberNum)) {
    return false;
  }

  return true;
}
