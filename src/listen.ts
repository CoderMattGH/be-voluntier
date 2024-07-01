import { logger } from "./logger";
import { app } from "./app";

const { PORT = 9090 } = process.env;
const { IP_ADD = "127.0.0.1" } = process.env;

app.listen(PORT, () => {
  logger.info(`App listening on port ${IP_ADD}!`);
});
