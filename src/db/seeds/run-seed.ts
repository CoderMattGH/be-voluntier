import {logger} from '../../logger';

import {seed} from './seed';

import type {VolUser, Listing} from '../data/types';
import {volUsers} from '../data/dev-data/vol_users';
import {listings} from '../data/dev-data/listings';

function runSeed() {
  logger.info("Seeding database!");

  seed(volUsers, listings)
      .then(() => {
        logger.info("Seeding successful!");
      })
      .catch((err: Error) => {
        logger.error("ERROR: Unable to complete seed!");
        logger.error(err);
      });
}

runSeed();