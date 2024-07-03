import { logger } from "../logger";
import { db } from "../db";
import * as registerUserValidator from "../validators/register-user.validator";

export function selectOrgUserByEmail(email: string) {
  logger.debug(`In selectOrgUserByEmail() in org-user.model`);
  logger.info(`Searching for org_user with email: ${email}`);

  email = email.trim();

  const queryStr = `SELECT * FROM org_users WHERE org_users.org_email ILIKE $1;`;

  return db.query(queryStr, [email]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "org_user not found!" });
    }

    return rows[0];
  });
}

export function selectOrgUserById(user_id: string) {
  logger.debug("In selectOrgUserById() in org-user.model");
  logger.info(`Selecting user by Id: ${user_id}`);

  const queryStr = `SELECT * FROM org_users WHERE org_users.org_id = $1;`;

  return db.query(queryStr, [user_id]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "org_user not found!" });
    }

    return rows[0];
  });
}

export function createOrgUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  contactTel: string | null,
  avatarImg: string | null,
  bio: string | null
) {
  // Role volunteer

  // Validate email
  const emailValObj = registerUserValidator.validateRegisterEmail(email);
  if (!emailValObj.valid) {
    return Promise.reject({ status: 400, msg: emailValObj.msg });
  }

  // Validate password

  // Validate first name
  const firstNameValObj =
    registerUserValidator.validateFirstLastName(firstName);
  if (!firstNameValObj.valid) {
    return Promise.reject({ status: 400, msg: firstNameValObj.msg });
  }

  // Validate last name
  const lastNameValObj = registerUserValidator.validateFirstLastName(lastName);
  if (!lastNameValObj.valid) {
    return Promise.reject({ status: 400, msg: lastNameValObj.msg });
  }

  // If telephone is empty string set to NULL
  if (contactTel !== null && !contactTel.trim().length) {
    contactTel = null;
  }

  // Validate telephone (NULLABLE)
  if (contactTel !== null) {
    const contTelValObj = registerUserValidator.validateContactTel(contactTel);
    if (!contTelValObj.valid) {
      return Promise.reject({ status: 400, msg: contTelValObj.msg });
    }
  }

  // If avatarImage is empty string set to NULL
  if (avatarImg !== null && !avatarImg.trim().length) {
    avatarImg = null;
  }

  // Validate image (NULLABLE)
  if (avatarImg !== null) {
    const avatarValObj = registerUserValidator.validateImage(avatarImg);
    if (!avatarValObj.valid) {
      return Promise.reject({ status: 400, msg: avatarValObj.msg });
    }
  }

  // If bio is empty string set to NULL
  if (bio !== null && !bio.trim().length) {
    bio = null;
  }

  // Validate bio (NULLABLE)
  if (bio !== null) {
    const bioValObj = registerUserValidator.validateBio(bio);
    if (!bioValObj.valid) {
      return Promise.reject({ status: 400, msg: bioValObj.msg });
    }
  }
}
