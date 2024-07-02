import { ENV } from "../../env-parser";
import { logger } from "../../logger";

import { db } from "../../db";
import { seed } from "../../db/seeds/seed";
import { testData } from "../../db/data/test-data/";

function runSeed() {
  logger.info("Seeding database!");

  let seedData;
  // TODO: Make dev data
  if (ENV === "test") {
    logger.info(`Loading test data!`);

    seedData = testData;
  } else {
    logger.info(`Loading test data!`);

    seedData = testData;
  }

  seed(seedData)
    .then(() => {
      logger.info("Seeding successful!");
    })
    .catch((err: Error) => {
      logger.error("ERROR: Unable to complete seed!");
      logger.error(err);
    })
    .finally(() => {
      return db.end();
    });
}

runSeed();
