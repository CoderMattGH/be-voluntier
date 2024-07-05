import { logger } from "../logger";
import { db } from "../db";

import * as registerUserValidator from "../validators/register-user.validator";
import * as imageValidator from "../validators/image.validator";
import { hashPassword } from "../auth/auth-utils";
import * as imagesModel from "../models/images.model";

export function selectVolUserByEmail(email: string) {
  logger.debug("In selectVolUserByEmail() in vol-user.model");
  logger.info(`Selecting user by email: ${email}`);

  email = email.trim();

  const queryStr = `SELECT * FROM vol_users WHERE vol_users.vol_email ILIKE $1;`;

  return db.query(queryStr, [email]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "vol_user not found!" });
    }

    return rows[0];
  });
}

export function selectVolUserById(user_id: string) {
  logger.debug("In selectVolUserById() in vol-user.model");
  logger.info(`Selecting user by Id: ${user_id}`);

  const queryStr = `SELECT * FROM vol_users WHERE vol_users.vol_id = $1;`;

  return db.query(queryStr, [user_id]).then((result) => {
    const { rows } = result;

    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "vol_user not found!" });
    }

    return rows[0];
  });
}

export function createVolUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  contactTel: string | null,
  avatarImg: string | null,
  bio: string | null
) {
  logger.debug(
    `Registering user where email:${email} password:${password} firstName:${firstName} ` +
      `lastName: ${lastName} contactTel: ${contactTel}`
  );

  // Validate email
  const emailValObj = registerUserValidator.validateRegisterEmail(email);
  if (!emailValObj.valid) {
    return Promise.reject({ status: 400, msg: emailValObj.msg });
  }

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

  return doesUserAccountExist(email)
    .then((emailAlreadyExists) => {
      if (emailAlreadyExists) {
        return Promise.reject({ status: 400, msg: "Email already exists!" });
      }

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

      const queryStr =
        `INSERT INTO vol_users (vol_email, vol_password, vol_first_name, vol_last_name, ` +
        `vol_contact_tel, vol_bio, vol_avatar_img_id, vol_hours) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, 0) RETURNING *;`;

      return db.query(queryStr, [
        email,
        hashPassword(password),
        firstName,
        lastName,
        contactTel,
        bio,
        imgId ? imgId.img_id : null,
      ]);
    })
    .then(({ rows }) => {
      if (!rows.length) {
        throw new Error("An unknown error occurred!");
      }

      logger.info(`${email} volunteer successfully registered!`);

      return rows[0];
    });
}

function doesUserAccountExist(email: string) {
  return db
    .query(
      "SELECT vol_email, org_email FROM vol_users, org_users WHERE vol_email = $1 OR org_email = $1;",
      [email]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
}

export async function updateVolUser(
  userId: number,
  changes: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    contactTel?: string | null;
    avatarImg?: string | null;
    bio?: string | null;
  }
) {
  logger.debug(`Updating vol user in model`);

  const setClauses: string[] = [];
  const queryParams: any[] = [];
  const changedFields: string[] = [];
  let paramIndex = 1;

  if (changes.email) {
    const emailValObj = registerUserValidator.validateRegisterEmail(
      changes.email
    );
    if (!emailValObj.valid) {
      return Promise.reject({ status: 400, msg: emailValObj.msg });
    }
    setClauses.push(`vol_email = $${paramIndex++}`);
    queryParams.push(changes.email);
    changedFields.push("email");
  }

  if (changes.password) {
    const passValObj = registerUserValidator.validatePassword(changes.password);
    if (!passValObj.valid) {
      return Promise.reject({ status: 400, msg: passValObj.msg });
    }
    setClauses.push(`vol_password = $${paramIndex++}`);
    queryParams.push(hashPassword(changes.password));
    changedFields.push("password");
  }

  if (changes.firstName) {
    const firstNameValObj = registerUserValidator.validateFirstLastName(
      changes.firstName
    );
    if (!firstNameValObj.valid) {
      return Promise.reject({ status: 400, msg: firstNameValObj.msg });
    }
    setClauses.push(`vol_first_name = $${paramIndex++}`);
    queryParams.push(changes.firstName);
    changedFields.push("firstName");
  }

  if (changes.lastName) {
    const lastNameValObj = registerUserValidator.validateFirstLastName(
      changes.lastName
    );
    if (!lastNameValObj.valid) {
      return Promise.reject({ status: 400, msg: lastNameValObj.msg });
    }
    setClauses.push(`vol_last_name = $${paramIndex++}`);
    queryParams.push(changes.lastName);
    changedFields.push("lastName");
  }

  if (changes.contactTel !== undefined) {
    if (changes.contactTel !== null) {
      const contTelValObj = registerUserValidator.validateContactTel(
        changes.contactTel
      );
      if (!contTelValObj.valid) {
        return Promise.reject({ status: 400, msg: contTelValObj.msg });
      }
    }
    setClauses.push(`vol_contact_tel = $${paramIndex++}`);
    queryParams.push(changes.contactTel);
    changedFields.push("contactTel");
  }

  if (changes.avatarImg !== undefined) {
    if (changes.avatarImg !== null) {
      const avatarValObj = imageValidator.validateImage(changes.avatarImg);
      if (!avatarValObj.valid) {
        return Promise.reject({ status: 400, msg: avatarValObj.msg });
      }
      const imgId = await imagesModel.createImage(changes.avatarImg);
      setClauses.push(`vol_avatar_img_id = $${paramIndex++}`);
      queryParams.push(imgId.img_id);
      changedFields.push("avatarImg");
    } else {
      setClauses.push(`vol_avatar_img_id = $${paramIndex++}`);
      queryParams.push(null);
      changedFields.push("avatarImg");
    }
  }

  if (changes.bio !== undefined) {
    if (changes.bio !== null) {
      const bioValObj = registerUserValidator.validateBio(changes.bio);
      if (!bioValObj.valid) {
        return Promise.reject({ status: 400, msg: bioValObj.msg });
      }
    }
    setClauses.push(`vol_bio = $${paramIndex++}`);
    queryParams.push(changes.bio);
    changedFields.push("bio");
  }

  if (setClauses.length === 0) {
    return Promise.resolve(null);
  }

  const queryStr = `
    UPDATE vol_users
    SET ${setClauses.join(", ")}
    WHERE vol_id = $${paramIndex}
    RETURNING *;
  `;
  queryParams.push(userId);

  return db.query(queryStr, queryParams).then((result) => {
    const { rows } = result;
    if (!rows.length) {
      return null;
    }
    return { success: true, changedFields };
  });
}
