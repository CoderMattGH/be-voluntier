import { logger } from "../../logger";
import format from "pg-format";
import { db } from "../../db";
import { hashPassword } from "../../auth/auth-utils";

import type {
  VolUser,
  OrgUser,
  Listing,
  Skill,
  OrgType,
  Badge,
  Application,
  ListSkillJunc,
  VolUserBadgeJunc,
  VolUserSkillJunc,
  FavouriteOrg,
  FavouriteListing,
} from "../data/types";

type SeedData = {
  volUsers: VolUser[];
  orgUsers: OrgUser[];
  listings: Listing[];
  skills: Skill[];
  orgTypes: OrgType[];
  badges: Badge[];
  applications: Application[];
  listSkillJuncs: ListSkillJunc[];
  volUserBadgeJuncs: VolUserBadgeJunc[];
  volUserSkillJuncs: VolUserSkillJunc[];
  favouriteOrgs: FavouriteOrg[];
  favouriteListings: FavouriteListing[];
};

export function seed({
  volUsers,
  orgUsers,
  listings,
  skills,
  orgTypes,
  badges,
  applications,
  listSkillJuncs,
  volUserBadgeJuncs,
  volUserSkillJuncs,
  favouriteOrgs,
  favouriteListings,
}: SeedData) {
  logger.debug("Starting db seed!");

  return dropTables()
    .then(() => {
      logger.info("Creating tables!");

      return setupSkillsTable(skills);
    })
    .then(() => {
      return setupBadgesTable(badges);
    })
    .then(() => {
      return setupOrgTypesTable(orgTypes);
    })
    .then(() => {
      return setupOrgUsersTable(orgUsers);
    })
    .then(() => {
      return setupListingsTable(listings);
    })
    .then(() => {
      return setupVolUsersTable(volUsers);
    })
    .then(() => {
      return setupApplicationsTable(applications);
    })
    .then(() => {
      return setupListSkillJuncTable(listSkillJuncs);
    })
    .then(() => {
      return setupVolUserBadgeJuncTable(volUserBadgeJuncs);
    })
    .then(() => {
      return setupVolUserSkillJuncTable(volUserSkillJuncs);
    })
    .then(() => {
      return setupFavouriteOrgsTable(favouriteOrgs);
    })
    .then(() => {
      return setupFavouriteListingsTable(favouriteListings);
    })
    .then(() => {
      return setupSessionTable();
    })
    .finally(() => {
      logger.info("Finished creating tables!");
      logger.info("Closing connection to database!");
    });
}

function dropTables() {
  logger.info(`Dropping tables!`);

  logger.debug(`Dropping session table!`);
  return db
    .query(`DROP TABLE IF EXISTS session;`)
    .then(() => {
      logger.debug(`Dropping list_skill_junc table!`);

      return db.query(`DROP TABLE IF EXISTS list_skill_junc;`);
    })
    .then(() => {
      logger.debug(`Dropping vol_user_badge_junc table!`);

      return db.query(`DROP TABLE IF EXISTS vol_user_badge_junc;`);
    })
    .then(() => {
      logger.debug(`Dropping favourite-orgs table!`);

      return db.query(`DROP TABLE IF EXISTS favourite_orgs;`);
    })
    .then(() => {
      logger.debug(`Dropping favourite-listings table!`);

      return db.query(`DROP TABLE IF EXISTS favourite_listings;`);
    })
    .then(() => {
      logger.debug(`Dropping vol_user_skill_junc table!`);

      return db.query(`DROP TABLE IF EXISTS vol_user_skill_junc;`);
    })
    .then(() => {
      logger.debug(`Dropping badges table!`);

      return db.query(`DROP TABLE IF EXISTS badges;`);
    })
    .then(() => {
      logger.debug(`Dropping applications table!`);

      return db.query(`DROP TABLE IF EXISTS applications;`);
    })
    .then(() => {
      logger.debug(`Dropping listings table!`);

      return db.query(`DROP TABLE IF EXISTS listings;`);
    })
    .then(() => {
      logger.debug(`Dropping org_users table!`);

      return db.query(`DROP TABLE IF EXISTS org_users;`);
    })
    .then(() => {
      logger.debug(`Dropping org_types table!`);

      return db.query(`DROP TABLE IF EXISTS org_types`);
    })
    .then(() => {
      logger.debug(`Dropping skills table!`);

      return db.query(`DROP TABLE IF EXISTS skills;`);
    })
    .then(() => {
      logger.debug(`Dropping vol_users table!`);

      return db.query(`DROP TABLE IF EXISTS vol_users;`);
    })
    .then(() => {
      logger.info(`Finished dropping tables!`);
    });
}

function setupSessionTable() {
  logger.debug("Setting up session table!");

  return db
    .query(
      `CREATE TABLE "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);`
    )
    .then(() => {
      return db.query(
        `ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") 
                NOT DEFERRABLE INITIALLY IMMEDIATE;`
      );
    })
    .then(() => {
      return db.query(
        `CREATE INDEX "IDX_session_expire" ON "session" ("expire");`
      );
    });
}

function setupVolUsersTable(volUsers: VolUser[]) {
  logger.debug("Setting up vol_users table!");

  return db
    .query(
      `CREATE TABLE vol_users (
      vol_id SERIAL PRIMARY KEY,
      vol_email VARCHAR(200) NOT NULL,
      vol_password VARCHAR(100) NOT NULL,
      vol_first_name VARCHAR(100) NOT NULL,
      vol_last_name VARCHAR(100) NOT NULL,
      vol_contact_tel VARCHAR(50),
      vol_avatar BYTEA,
      vol_bio TEXT,
      vol_hours INT
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO vol_users (
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
            volUser.vol_hours,
          ];
        })
      );

      return db.query(queryStr);
    });
}

// TODO: Delete cascades and removes listings
function setupOrgUsersTable(orgUsers: OrgUser[]) {
  logger.debug(`Setting up org_users table!`);

  return db
    .query(
      `CREATE TABLE org_users (
      org_id SERIAL PRIMARY KEY,
      org_name VARCHAR(100) NOT NULL,
      org_email VARCHAR(100) NOT NULL,
      org_password VARCHAR(100) NOT NULL,
      org_type INT REFERENCES org_types(type_id) NOT NULL,
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
          org_password,
          org_type,
          org_contact_tel,
          org_bio,
          org_verified
        ) VALUES %L;`,
        orgUsers.map((orgUser) => {
          return [
            orgUser.org_name,
            orgUser.org_email,
            hashPassword(orgUser.org_password),
            orgUser.org_type,
            orgUser.org_contact_tel,
            orgUser.org_bio,
            orgUser.org_verified,
          ];
        })
      );

      return db.query(queryStr);
    });
}

function setupOrgTypesTable(orgTypes: OrgType[]) {
  logger.debug("Setting up org_types table!");

  return db
    .query(
      `CREATE TABLE org_types (
      type_id SERIAL PRIMARY KEY,
      type_title VARCHAR(100)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO org_types(
          type_title
        ) VALUES %L;`,
        orgTypes.map((orgType) => {
          return [orgType.type_title];
        })
      );

      return db.query(queryStr);
    });
}

function setupBadgesTable(badges: Badge[]) {
  logger.debug("Setting up badges table!");

  return db
    .query(
      `CREATE TABLE badges (
      badge_id SERIAL PRIMARY KEY,
      badge_name VARCHAR(100),
      badge_img_path VARCHAR(200),
      badge_points INT
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO badges(
          badge_name,
          badge_img_path,
          badge_points
        ) VALUES %L;`,
        badges.map((badge) => {
          return [badge.badge_name, badge.badge_img_path, badge.badge_points];
        })
      );

      return db.query(queryStr);
    });
}

// TODO: Listings cascades and deletes applications
// TODO: Images
function setupListingsTable(listings: Listing[]) {
  logger.debug("Setting up listings table!");

  return db
    .query(
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
      list_img BYTEA,
      list_visible BOOL,
      list_org INT REFERENCES org_users(org_id) NOT NULL
    );`
    )
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
            listing.list_org,
          ];
        })
      );

      return db.query(queryStr);
    });
}

function setupSkillsTable(skills: Skill[]) {
  logger.debug("Setting up skills table!");

  return db
    .query(
      `CREATE TABLE skills (
      skill_id SERIAL PRIMARY KEY,
      skill_name VARCHAR(100) NOT NULL
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO skills (
          skill_id,
          skill_name
        ) VALUES %L;`,
        skills.map((skill) => {
          return [skill.skill_id, skill.skill_name];
        })
      );

      return db.query(queryStr);
    });
}

function setupApplicationsTable(applications: Application[]) {
  logger.debug("Setting up applications table!");

  return db
    .query(
      `CREATE TABLE applications (
      app_id SERIAL PRIMARY KEY,
      vol_id INT REFERENCES vol_users(vol_id) NOT NULL,
      listing_id INT REFERENCES listings(list_id) NOT NULL,
      prov_confirm BOOL NOT NULL,
      full_conf BOOL NOT NULL
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO applications (
          vol_id,
          listing_id,
          prov_confirm,
          full_conf 
        ) VALUES %L;`,
        applications.map((application) => {
          return [
            application.vol_id,
            application.listing_id,
            application.prov_confirm,
            application.full_conf,
          ];
        })
      );

      return db.query(queryStr);
    });
}

function setupListSkillJuncTable(listSkillJuncs: ListSkillJunc[]) {
  logger.debug("Setting up list_skill_junc table!");

  return db
    .query(
      `CREATE TABLE list_skill_junc (
      list_skill_id SERIAL PRIMARY KEY,
      list_id INT REFERENCES listings(list_id),
      skill_id INT REFERENCES skills(skill_id)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO list_skill_junc (
          list_id,
          skill_id
        ) VALUES %L;`,
        listSkillJuncs.map((obj) => {
          return [obj.list_id, obj.skill_id];
        })
      );

      return db.query(queryStr);
    });
}

function setupVolUserBadgeJuncTable(volUserBadgeJuncs: VolUserBadgeJunc[]) {
  logger.debug("Setting up vol_user_badge_junc table!");

  return db
    .query(
      `CREATE TABLE vol_user_badge_junc (
      vol_user_badge_id SERIAL PRIMARY KEY,
      vol_id INT REFERENCES vol_users(vol_id),
      badge_id INT REFERENCES badges(badge_id)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO vol_user_badge_junc (
          vol_id,
          badge_id
        ) VALUES %L;`,
        volUserBadgeJuncs.map((obj) => {
          return [obj.vol_id, obj.badge_id];
        })
      );

      return db.query(queryStr);
    });
}

function setupVolUserSkillJuncTable(volUserSkillJuncs: VolUserSkillJunc[]) {
  logger.debug("Setting up vol_user_skill_junc table!");

  return db
    .query(
      `CREATE TABLE vol_user_skill_junc (
      vol_user_skill_id SERIAL PRIMARY KEY,
      vol_id INT REFERENCES vol_users(vol_id),
      skill_id INT REFERENCES skills(skill_id)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO vol_user_skill_junc (
          vol_id,
          skill_id
        ) VALUES %L;`,
        volUserSkillJuncs.map((obj) => {
          return [obj.vol_id, obj.skill_id];
        })
      );

      return db.query(queryStr);
    });
}

function setupFavouriteOrgsTable(favouriteOrgs: FavouriteOrg[]) {
  logger.debug("Setting up favourite-orgs table!");

  return db
    .query(
      `CREATE TABLE favourite_orgs (
      fav_orgs_id SERIAL PRIMARY KEY,
      vol_id INT REFERENCES vol_users(vol_id),
      org_id INT REFERENCES org_users(org_id)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO favourite_orgs (
        vol_id,
        org_id
      ) VALUES %L;`,
        favouriteOrgs.map((obj) => {
          return [obj.vol_id, obj.org_id];
        })
      );

      return db.query(queryStr);
    });
}

function setupFavouriteListingsTable(favouriteListings: FavouriteListing[]) {
  logger.debug("Setting up favourite-listings table!");

  return db
    .query(
      `CREATE TABLE favourite_listings (
      fav_lists_id SERIAL PRIMARY KEY,
      vol_id INT REFERENCES vol_users(vol_id),
      list_id INT REFERENCES listings(list_id)
    );`
    )
    .then(() => {
      const queryStr = format(
        `INSERT INTO favourite_listings (
        vol_id,
        list_id
      ) VALUES %L;`,
        favouriteListings.map((obj) => {
          return [obj.vol_id, obj.list_id];
        })
      );

      return db.query(queryStr);
    });
}
