import { logger } from "../logger";
import { db } from "../db";
import { doesUserAccountExist } from "./misc-user.model";
import * as registerUserValidator from "../validators/register-user.validator";
import * as imageValidator from "../validators/image.validator";
import * as imagesModel from "../models/images.model";
import * as orgTypesModel from "../models/org-types.model";
import { hashPassword } from "../auth/auth-utils";

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
  orgName: string,
  orgTypeId: number,
  contactTel: string | null,
  avatarImg: string | null,
  bio: string | null
) {
  logger.debug(`In createOrgUser in org-user-model`);
  logger.info(
    `Registering org_user where email: ${email} password: ${password} ` +
      `orgName: ${orgName} contactTel: ${contactTel} avatarImg: ${avatarImg} bio: ${bio}`
  );

  // Validate email
  const emailValObj = registerUserValidator.validateRegisterEmail(email);
  if (!emailValObj.valid) {
    return Promise.reject({ status: 400, msg: emailValObj.msg });
  }

  // Validate org name
  const orgValObj = registerUserValidator.validateOrgName(orgName);
  if (!orgValObj.valid) {
    return Promise.reject({ status: 400, msg: orgValObj.msg });
  }

  // Validate org type
  const orgTypeValObj = registerUserValidator.validateOrgTypeId(orgTypeId);
  if (!orgTypeValObj.valid) {
    return Promise.reject({ status: 400, msg: orgTypeValObj.msg });
  }

  // Validate telephone is empty string set to NULL
  // If telephone is empty string set to NULL
  if (!contactTel || !contactTel.trim().length) {
    contactTel = null;
  } else {
    contactTel = contactTel.trim();
  }

  // Validate telephone (NULLABLE)
  if (contactTel !== null) {
    const contTelValObj = registerUserValidator.validateContactTel(contactTel);
    if (!contTelValObj.valid) {
      return Promise.reject({ status: 400, msg: contTelValObj.msg });
    }
  }

  // If avatarImage is empty string set to NULL
  if (!avatarImg || !avatarImg.trim().length) {
    avatarImg = null;
  }

  // Validate image (NULLABLE)
  if (avatarImg !== null) {
    const avatarValObj = imageValidator.validateImage(avatarImg);
    if (!avatarValObj.valid) {
      return Promise.reject({ status: 400, msg: avatarValObj.msg });
    }
  }

  // If bio is empty string set to NULL
  if (!bio || !bio.trim().length) {
    bio = null;
  }

  // Validate bio (NULLABLE)
  if (bio !== null) {
    const bioValObj = registerUserValidator.validateBio(bio);
    if (!bioValObj.valid) {
      return Promise.reject({ status: 400, msg: bioValObj.msg });
    }
  }

  // Validate password last!
  const passValObj = registerUserValidator.validatePassword(password);
  if (!passValObj.valid) {
    return Promise.reject({ status: 400, msg: passValObj.msg });
  }

  return orgTypesModel
    .selectOrgTypesWithId()
    .then(({ orgTypes }) => {
      let orgTypeFound = false;
      for (const orgT of orgTypes) {
        if (orgTypeId === orgT.type_id) {
          orgTypeFound = true;
          break;
        }
      }

      if (!orgTypeFound) {
        return Promise.reject({
          status: 400,
          msg: "Organisation type does not exist and is not valid!",
        });
      }

      logger.debug("Org type OK!");

      logger.debug("Checking whether email already exists!");

      return doesUserAccountExist(email);
    })
    .then((emailAlreadyExists) => {
      if (emailAlreadyExists) {
        return Promise.reject({ status: 400, msg: "Email already exists!" });
      }

      logger.debug("Email is OK!");

      // Add avatar if attached
      let avatarPromise;
      if (avatarImg !== null) {
        avatarPromise = imagesModel.createImage(avatarImg);
      } else {
        avatarPromise = Promise.resolve(null);
      }

      return avatarPromise;
    })
    .then((imgId) => {
      if (imgId !== null) {
        logger.debug(`Avatar image was created with img_id: ${imgId.img_id}!`);
      }

      const queryStr = `INSERT INTO org_users (org_name, org_email, org_password, org_type, 
        org_contact_tel, org_bio, org_avatar_img_id, org_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *;`;

      logger.debug("Trying to insert org_user into DB table!");

      return db.query(queryStr, [
        orgName,
        email,
        hashPassword(password),
        orgTypeId,
        contactTel,
        bio,
        avatarImg,
      ]);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject("An unknown error occurred!");
      }

      return rows[0];
    });
}
