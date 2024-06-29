import seed from './seed';

import { VolUser } from '../data/dev-data/vol_users';
import volUsers from '../data/dev-data/vol_users';

function runSeed(): void {
  console.log("Seeding database!");

  const typedVolUsers: VolUser[] = volUsers;
  seed(typedVolUsers)
      .then(() => {
        console.log("Seed successful!");
      })
      .catch((err: Error) => {
        console.log("ERROR: Unable to complete seed!");
        console.log(err);
      });
}

runSeed();