import {logger} from '../../logger';

import format from 'pg-format';
import {db} from '../';

import type {VolUser, Listing} from '../data/types';

import * as authUtils from '../../auth/auth-utils';
const {hashPassword} = authUtils;

export function seed(volUsers: VolUser[], listings: Listing[]) {
  logger.debug("Starting db seed!");
  
  return setupVolUsersTable(volUsers)
      .then(() => {
        return setupListingsTable(listings);
      })
      .then(() => {
        return setupSessionTable();
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