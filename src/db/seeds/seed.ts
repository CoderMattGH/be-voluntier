import {logger} from '../../logger';
import format from 'pg-format';
import {db} from '../';
import {hashPassword} from '../../auth/auth-utils';

import type {VolUser, OrgUser, Listing, Skill, OrgType} from '../data/types';

export function seed(volUsers: VolUser[], orgUsers: OrgUser[], listings: Listing[], skills: Skill[],
    orgTypes: OrgType[]) {
  logger.debug("Starting db seed!");
  
  return setupSkillsTable(skills)
      .then(() => {
        return setupOrgTypesTable(orgTypes);
      })
      .then(() => {
        return setupListingsTable(listings);
      })
      .then(() => {
        return setupVolUsersTable(volUsers);
      })
      .then(() => {
        return setupOrgUsersTable(orgUsers);
      })
      .then(() => {
        return setupSessionTable();
      })
      .finally(() => {
        logger.info("Closing connection to database!");
        
        return db.end();
      });      
}

function setupSessionTable() {
  logger.debug("Setting up session table!");

  return db.query(`DROP TABLE IF EXISTS session;`)
      .then(() => {
        return db.query(
          `CREATE TABLE "session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
          )
          WITH (OIDS=FALSE);`)
      })
      .then(() => {
        return db.query(
            `ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") 
                NOT DEFERRABLE INITIALLY IMMEDIATE;`);
      })
      .then(() => {
        return db.query(
            `CREATE INDEX "IDX_session_expire" ON "session" ("expire");`);
      });
}

function setupVolUsersTable(volUsers: VolUser[]) {
  logger.debug("Setting up vol_user table!");
  
  return db.query(`DROP TABLE IF EXISTS vol_user;`)
      .then(() => {
        return db.query(
          `CREATE TABLE vol_user (
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
        const queryStr = format(
          `INSERT INTO vol_user (
            vol_first_name,
            vol_last_name,
            vol_email,
            vol_password,
            vol_contact_tel,
            vol_bio,
            vol_hours
          ) VALUES %L;`,
          volUsers.map((volUser) => {
            return [
              volUser.vol_first_name,
              volUser.vol_last_name,
              volUser.vol_email,
              hashPassword(volUser.vol_password),
              volUser.vol_contact_tel,
              volUser.vol_bio,
              volUser.vol_hours
            ];
          })
        );

        return db.query(queryStr);
      });  
}

function setupOrgUsersTable(orgUsers: OrgUser[]) {
  logger.debug(`Setting up org_users table!`);

  return db.query(`DROP TABLE IF EXISTS org_users;`)
      .then(() => {
        return db.query(
          `CREATE TABLE org_users (
            org_id SERIAL PRIMARY KEY,
            org_name VARCHAR(100) NOT NULL,
            org_email VARCHAR(100) NOT NULL,
            org_contact_tel VARCHAR(100),
            org_bio TEXT,
            org_avatar BYTEA,
            org_verified BOOLEAN
          );`
        )
        .then(() => {
          const queryStr = format(
            `INSERT INTO org_users (
              org_name,
              org_email,
              org_contact_tel,
              org_bio,
              org_verified
            ) VALUES %L;`,
            orgUsers.map((orgUser) => {
              return [
                orgUser.org_name,
                orgUser.org_email,
                orgUser.org_contact_tel,
                orgUser.org_bio,
                orgUser.org_verified
              ];
            })
          );

          return db.query(queryStr);
        });
      });
}

function setupOrgTypesTable(orgTypes: OrgType[]) {
  logger.debug("Setting up org_types table!");

  return db.query(`DROP TABLE IF EXISTS org_types`)
      .then(() => {
        return db.query(
          `CREATE TABLE org_types (
            type_id SERIAL PRIMARY KEY,
            type_title VARCHAR(100)
          );`
        );
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO org_types(
            type_title
          ) VALUES %L;`,
          orgTypes.map((orgType) => {
            return [
              orgType.type_title
            ];
          })
        );

        return db.query(queryStr);
      });
}

function setupListingsTable(listings: Listing[]) {
  logger.debug("Setting up listings table!");

  // TODO: list_org INT FK
  // TODO: list_skills FK
  return db.query(`DROP TABLE IF EXISTS listings;`)
      .then(() => {
        return db.query(
          `CREATE TABLE listings (
            list_id SERIAL PRIMARY KEY,
            list_title VARCHAR(200) NOT NULL,
            list_location VARCHAR(100) NOT NULL,
            list_longitude DOUBLE PRECISION NOT NULL,
            list_latitude DOUBLE PRECISION NOT NULL,
            list_date DATE NOT NULL,
            list_time TIME NOT NULL,
            list_duration INT NOT NULL,
            list_description TEXT NOT NULL,
            list_img VARCHAR(200),
            list_visible BOOL,
            list_org VARCHAR(200)
          );`
        )
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO listings (
            list_title,
            list_location,
            list_longitude,
            list_latitude,
            list_date,
            list_time,
            list_duration,
            list_description,
            list_visible,
            list_org
          ) VALUES %L;`,
          listings.map((listing) => {
            return [
              listing.list_title,
              listing.list_location,
              listing.list_longitude,
              listing.list_latitude,
              listing.list_date,
              listing.list_time,
              listing.list_duration,
              listing.list_description,
              listing.list_visible,
              listing.list_org
            ];
          })
        );

        return db.query(queryStr);
      })
}

function setupSkillsTable(skills: Skill[]) {
  logger.debug("Setting up skills table!");

  return db.query(`DROP TABLE IF EXISTS skills;`)
      .then(() => {
        return db.query(
          `CREATE TABLE skills (
            skill_id SERIAL PRIMARY KEY,
            skill_name VARCHAR(100) NOT NULL
          );`
        );
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO skills (
            skill_name
          ) VALUES %L;`,
          skills.map((skill) => {
            return [skill.skill_name];
          })
        );

        return db.query(queryStr);
      });
}