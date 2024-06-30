import {logger} from '../logger';
import {db} from '../db';

// TODO: Validate email
export function selectVolUserByEmail(email: string) {
  logger.debug("In selectVolUserByEmail() in vol-user.model");
  logger.info(`Selecting user by email: ${email}`)

  email = email.trim();

  const queryStr = `SELECT * FROM vol_user WHERE vol_user.vol_email ILIKE $1;`;

  return db.query(queryStr, [email])
      .then((result) => {
        const {rows} = result;

        if (!rows.length) {
          throw new Error("VOL_USER_NOT_FOUND");
        }

        return rows[0];
      });
};