import {logger} from '../../logger';

import {seed} from './seed';

import {VolUser} from '../data/types';
import volUsers from '../data/dev-data/vol_users';

function runSeed() {
  logger.info("Seeding database!");

  const typedVolUsers: VolUser[] = volUsers;
  seed(typedVolUsers)
      .then(() => {
        logger.info("Seeding successful!");
      })
      .catch((err: Error) => {
        logger.error("ERROR: Unable to complete seed!");
        logger.error(err);
      });
}

runSeed();