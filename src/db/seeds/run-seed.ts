import { ENV } from "../../env-parser";
import { logger } from "../../logger";

import { db } from "../";
import { seed } from "./seed";
import { devData } from "../data/dev-data/";
import { testData } from "../data/test-data/";

function runSeed() {
  logger.info("Seeding database!");

  let seedData;
  if (ENV === "test") {
    logger.info(`Loading test data!`);

    seedData = testData;
  } else {
    logger.info(`Loading dev data!`);

    seedData = devData;
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
