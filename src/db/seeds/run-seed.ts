import {logger} from '../../logger';
import {seed} from './seed';

// TODO: Import based on env
import {volUsers} from '../data/dev-data/vol_users';
import {listings} from '../data/dev-data/listings';
import {skills} from '../data/dev-data/skills';

function runSeed() {
  logger.info("Seeding database!");

  seed(volUsers, listings, skills)
      .then(() => {
        logger.info("Seeding successful!");
      })
      .catch((err: Error) => {
        logger.error("ERROR: Unable to complete seed!");
        logger.error(err);
      });
}

runSeed();