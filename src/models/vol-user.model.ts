import {db} from '../db/connection';

// TODO: Validate email
export function selectVolUserByEmail(email: string) {
  email = email.trim();

  const queryStr = `SELECT * FROM vol_user WHERE vol_user.vol_email ILIKE $1;`;

  return db.query(queryStr, [email])
      .then((result) => {
        const {rows} = result;

        if (!rows.length) {
          return new Error("VOL_USER_NOT_FOUND");
        }

        return rows[0];
      });
};