import * as constants from "../constants";
import * as miscValidator from "./misc.validator";

export const validateRegisterEmail = (email: string | undefined) => {
  if (!email) {
    return { valid: false, msg: "Email cannot be empty!" };
  }

  if (!email.trim().length) {
    return { valid: false, msg: "Email cannot be empty!" };
  }

  if (email.trim().length !== email.length) {
    return { valid: false, msg: "Email cannot start or end with spaces!" };
  }

  if (
    email.length < constants.MIN_EMAIL_LENGTH ||
    email.length > constants.MAX_EMAIL_LENGTH
  ) {
    const str =
      `Email address must be between ${constants.MIN_EMAIL_LENGTH} and ` +
      `${constants.MAX_EMAIL_LENGTH} characters!`;
    return {
      valid: false,
      msg: str,
    };
  }

  const emailPattern = constants.VAL_EMAIL_PATTERN;
  if (!emailPattern.test(email)) {
    return { valid: false, msg: "Email address is not valid!" };
  }

  return { valid: true };
};

export function validateFirstLastName(name: string | undefined) {
  if (!name) {
    return { valid: false, msg: "Name cannot be empty!" };
  }

  if (!name.trim().length) {
    return { valid: false, msg: "Name cannot be empty!" };
  }

  if (name.trim().length !== name.length) {
    return { valid: false, msg: "Name cannot start or end with spaces!" };
  }

  if (
    name.length < constants.MIN_NAME_LENGTH ||
    name.length > constants.MAX_NAME_LENGTH
  ) {
    const str =
      `Name must be between ${constants.MIN_NAME_LENGTH} and ` +
      `${constants.MAX_NAME_LENGTH} characters!`;
    return { valid: false, msg: str };
  }

  // Name can not contains numbers or symbols
  const namePattern = constants.VAL_NAME_PATTERN;
  if (!namePattern.test(name)) {
    return { valid: false, msg: "Name is not valid!" };
  }

  return { valid: true };
}

export function validateOrgName(name: string | undefined) {
  return validateFirstLastName(name);
}

export function validateContactTel(contactTel: string | undefined) {
  if (!contactTel) {
    return { valid: false, msg: "Contact Telephone cannot be empty!" };
  }

  if (!contactTel.trim().length) {
    return { valid: false, msg: "Contact Telephone cannot be empty!" };
  }

  if (contactTel.trim().length !== contactTel.length) {
    return {
      valid: false,
      msg: "Contact Telephone cannot start or end with spaces!",
    };
  }

  if (
    contactTel.length < constants.MIN_CONT_TEL_LENGTH ||
    contactTel.length > constants.MAX_CONT_TEL_LENGTH
  ) {
    const str =
      `Contact Telephone must be between ${constants.MIN_CONT_TEL_LENGTH} and ` +
      `${constants.MAX_CONT_TEL_LENGTH} characters!`;
    return { valid: false, msg: str };
  }

  const contactTelPattern = constants.CONT_TEL_PATTERN;
  if (!contactTelPattern.test(contactTel)) {
    return {
      valid: false,
      msg: "Contact Telephone must only contain numbers!",
    };
  }

  return { valid: true };
}

export function validateBio(bio: string | undefined) {
  if (!bio) {
    return { valid: false, msg: "Bio cannot be empty!" };
  }

  if (!bio.trim().length) {
    return { valid: false, msg: "Bio cannot be empty!" };
  }

  if (bio.trim().length !== bio.length) {
    return {
      valid: false,
      msg: "Bio cannot start or end with spaces!",
    };
  }

  if (
    bio.length < constants.MIN_BIO_SIZE ||
    bio.length > constants.MAX_BIO_SIZE
  ) {
    const str =
      `Bio must be between ${constants.MIN_BIO_SIZE} and ${constants.MAX_BIO_SIZE} ` +
      `characters in length!`;
    return { valid: false, msg: str };
  }

  return { valid: true };
}

export function validatePassword(password: string | undefined) {
  if (!password) {
    return { valid: false, msg: "Password cannot be empty!" };
  }

  if (!password.trim().length) {
    return { valid: false, msg: "Password cannot be empty!" };
  }

  if (password.trim().length !== password.length) {
    return {
      valid: false,
      msg: "Password cannot start or end with spaces!",
    };
  }

  if (
    password.length < constants.MIN_PASSWD_LENGTH ||
    password.length > constants.MAX_PASSWD_LENGTH
  ) {
    const str =
      `Password must be between ${constants.MIN_PASSWD_LENGTH} and ` +
      `${constants.MAX_PASSWD_LENGTH} characters in length!`;

    return {
      valid: false,
      msg: str,
    };
  }

  const passwordPattern = constants.VAL_PASSWD_PATTERN;
  if (!passwordPattern.test(password)) {
    return {
      valid: false,
      msg: "Password must not contain whitespace characters!",
    };
  }

  return { valid: true };
}

export function validateOrgTypeId(orgType: number | undefined) {
  if (orgType === undefined) {
    return { valid: false, msg: "Org Type ID is undefined!" };
  }

  if (!miscValidator.isNumber(orgType)) {
    return { valid: false, msg: "Org Type ID is not a number!" };
  }

  if (orgType < 0) {
    return { valid: false, msg: "Org type ID must be a positive integer!" };
  }

  if (!Number.isInteger(orgType)) {
    return { valid: false, msg: "Org type ID must be a postive integer!;" };
  }

  return { valid: true };
}

export function validateOrgType(orgType: string | undefined) {
  if (!orgType) {
    return { valid: false, msg: "Org type is undefined!" };
  }

  if (miscValidator.isEmptyString(orgType)) {
    return { valid: false, msg: "Org type is an empty string!" };
  }

  if (miscValidator.startsEndsWSpaces(orgType)) {
    return { valid: false, msg: "Org type cannot start or end with spaces!" };
  }

  if (
    orgType.length < constants.MIN_ORG_TYPE_LENGTH ||
    orgType.length > constants.MAX_ORG_TYPE_LENGTH
  ) {
    return {
      valid: false,
      msg:
        `Org type must be between ${constants.MIN_ORG_TYPE_LENGTH} and ` +
        `${constants.MAX_ORG_TYPE_LENGTH} characters in length!`,
    };
  }

  return { valid: true };
}
