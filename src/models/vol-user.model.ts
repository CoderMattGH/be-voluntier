import db from '../db/connection';

// TODO: Validate email
function selectVolUserByEmail(email: string) : Promise<any> {
  email = email.trim();

  const queryStr: string = `SELECT * FROM vol_user WHERE vol_user.vol_email ILIKE $1;`;

  return db.query(queryStr, [email])
      .then((result) => {
        const {rows} = result;

        if (!rows.length) {
          return new Error("VOL_USER_NOT_FOUND");
        }

        return rows[0];
      });
};

export default {selectVolUserByEmail};