import * as constants from "../constants";
import { isEmptyString, startsEndsWSpaces } from "./misc.validator";

export function validateTitle(title: string) {
  if (!title || isEmptyString(title)) {
    return { valid: false, msg: "list_title cannot be empty!" };
  }

  if (startsEndsWSpaces(title)) {
    return { valid: false, msg: "list_title cannot start or end with spaces!" };
  }

  if (
    title.length < constants.MIN_TITLE_LENGTH ||
    title.length > constants.MAX_TITLE_LENGTH
  ) {
    const str =
      `list_title must be between ${constants.MIN_TITLE_LENGTH} and ` +
      `${constants.MAX_TITLE_LENGTH} characters in length!`;
    return {
      valid: false,
      msg: str,
    };
  }

  // Must only contain letters, numbers and spaces
  if (!constants.VAL_TITLE_PATTERN.test(title)) {
    return { valid: false, msg: "list_title contains invalid symbols!" };
  }

  return { valid: true };
}

export function validateLocation(location: string) {
  if (!location || isEmptyString(location)) {
    return { valid: false, msg: "list_location cannot be empty!" };
  }

  if (startsEndsWSpaces(location)) {
    return {
      valid: false,
      msg: "list_location cannot start or end with spaces!",
    };
  }

  if (
    location.length < constants.MIN_LOCAT_LENGTH ||
    location.length > constants.MAX_LOCAT_LENGTH
  ) {
    const str =
      `list_location must be between ${constants.MIN_LOCAT_LENGTH} and ` +
      `${constants.MAX_LOCAT_LENGTH} characters in length!`;

    return { valid: false, msg: str };
  }

  if (!constants.VAL_LOCAT_PATTERN.test(location)) {
    return { valid: false, msg: "list_location contains invalid symbols!" };
  }

  return { valid: true };
}

export function validateDate(date: string) {
  if (!date || isEmptyString(date)) {
    return { valid: false, msg: "list_date cannot be empty!" };
  }

  if (startsEndsWSpaces(date)) {
    return { valid: false, msg: "list_date cannot start or end with spaces!" };
  }

  if (new Date(date).toString() === "Invalid Date") {
    return { status: 400, msg: "list_date is in an invalid format!" };
  }

  return { valid: true };
}

export function validateTime(time: string) {
  if (!time || isEmptyString(time)) {
    return { valid: false, msg: "list_time cannot be empty!" };
  }

  if (startsEndsWSpaces(time)) {
    return { valid: false, msg: "list_time cannot start or end with spaces!" };
  }

  if (!constants.VAL_LIST_TIME_PATTERN.test(time)) {
    return { status: 400, msg: "list_time is in an invalid format!" };
  }

  return { valid: true };
}

export function validateDuration(duration: number) {
  if (!duration) {
    return { valid: false, msg: "duration cannot be empty!" };
  }

  if (Number.isNaN(duration)) {
    return { valid: false, msg: "duration is not a number!" };
  }

  if (duration < 0 || duration > constants.MAX_LIST_DURATION) {
    return {
      valid: false,
      msg:
        `duration must not be negative or exceed ` +
        `${constants.MAX_LIST_DURATION} hours!`,
    };
  }

  return { valid: true };
}

export function validateDescription(description: string) {
  if (!description || isEmptyString(description)) {
    return { valid: false, msg: "Description cannot be empty!" };
  }

  if (startsEndsWSpaces(description)) {
    return {
      valid: false,
      msg: "description cannot start or end with spaces!",
    };
  }

  if (
    description.length < constants.MIN_LIST_DESC_LENGTH ||
    description.length > constants.MAX_LIST_DESC_LENGTH
  ) {
    return {
      valid: false,
      msg:
        `description must be between ${constants.MIN_LIST_DESC_LENGTH} ` +
        `${constants.MAX_LIST_DESC_LENGTH} in length!`,
    };
  }

  return { valid: true };
}

export function validateLongLat(longLat: number) {
  if (longLat === undefined || longLat === null) {
    return {
      valid: false,
      msg: "list_longitude or list_latitude cannot be empty!",
    };
  }

  if (Number.isNaN(longLat)) {
    return {
      valid: false,
      msg: "list_longitude or list_latitude is not a number!",
    };
  }

  return { valid: true };
}

// TODO: Prevent listing skills twice
export function validateSkills(skills: string[]) {
  if (!skills || !skills.length) {
    return { valid: false, msg: "list_skills cannot be empty!" };
  }

  if (!Array.isArray(skills)) {
    return { valid: false, msg: "list_skills must be an array!" };
  }

  // Check skills are strings
  for (const skill of skills) {
    if (!skill || typeof skill !== "string") {
      return { valid: false, msg: "skills must be strings!" };
    }
  }

  // TODO: query database for skills
  const skillMap = new Map();
  skillMap.set(1, "Physical Work");
  skillMap.set(2, "Teamwork");
  skillMap.set(3, "Gardening");
  skillMap.set(4, "Running");
  skillMap.set(5, "Fundraising");
  skillMap.set(6, "Community Engagement");
  skillMap.set(7, "Organization");
  skillMap.set(8, "Animal Care");
  skillMap.set(9, "Patience");
  skillMap.set(10, "Sales");
  skillMap.set(11, "Cooking");
  skillMap.set(12, "Mentoring");
  skillMap.set(13, "Sports");
  skillMap.set(14, "Art");
  skillMap.set(15, "Teaching");
  skillMap.set(16, "First Aid");

  const skillIndexes = [];
  for (const skill of skills) {
    let found = false;

    for (const [key, value] of skillMap.entries()) {
      if (skill.toLowerCase() === value.toLowerCase()) {
        found = true;
        break;
      }
    }

    if (!found) {
      return { status: 400, msg: `Invalid skill found! (${skill})` };
    }
  }

  if (skills.length > constants.MAX_LIST_SKILLS) {
    return {
      status: 400,
      msg: `You may only list a maximum of ${constants.MAX_LIST_SKILLS}!`,
    };
  }

  return { valid: true };
}

export function validateVisibility(visibility: boolean) {
  if (visibility === null || visibility === undefined) {
    return { valid: false, msg: "list_visible cannot be empty!" };
  }

  // Must be true
  if (visibility !== true) {
    return { valid: false, msg: "list_visible must be true!" };
  }

  return { valid: true };
}
