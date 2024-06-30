import {logger} from '../../logger';
import {seed} from './seed';

// TODO: Import based on env
import {volUsers} from '../data/dev-data/vol-users';
import {orgUsers} from '../data/dev-data/org-users';
import {orgTypes} from '../data/dev-data/org-types';
import {listings} from '../data/dev-data/listings';
import {skills} from '../data/dev-data/skills';
import { badges } from '../data/dev-data/badge';

function runSeed() {
  logger.info("Seeding database!");

  seed(volUsers, orgUsers, listings, skills, orgTypes, badges)
      .then(() => {
        logger.info("Seeding successful!");
      })
      .catch((err: Error) => {
        logger.error("ERROR: Unable to complete seed!");
        logger.error(err);
      });
}

runSeed();