import format from 'pg-format';
import db from '../connection';

import { VolUser } from '../data/types';

function seed(volUsers: VolUser[]): Promise<any> {
  console.log("Seeding database!");
  
  return db
      .query(`DROP TABLE IF EXISTS vol_user_table;`)
      .then(() => {
        console.log("Creating vol_user_table!");

        return db.query(`
            CREATE TABLE vol_user_table (
              vol_id SERIAL PRIMARY KEY,
              vol_email VARCHAR(200) NOT NULL,
              vol_password VARCHAR(100) NOT NULL,
              vol_first_name VARCHAR(100) NOT NULL,
              vol_last_name VARCHAR(100) NOT NULL,
              vol_contact_tel VARCHAR(50),
              vol_avatar BYTEA,
              vol_bio TEXT,
              vol_hours INT,
              vol_badges INT
            );`
        );
      })
      .then(() => {
        console.log("Populating vol_user_table!");

        const insertVolUsersQueryStr = format(`
            INSERT INTO vol_user_table 
              (
                vol_first_name,
                vol_last_name,
                vol_email,
                vol_contact_tel,
                vol_bio,
                vol_hours
              ) VALUES %L;`,
            volUsers.map((volUser) => {
              return [
                volUser.vol_first_name,
                volUser.vol_last_name,
                volUser.vol_email,
                volUser.vol_contact_tel,
                volUser.vol_bio,
                volUser.vol_hours
              ];
            })
        );

        return db.query(insertVolUsersQueryStr);
      });
}

export default seed;