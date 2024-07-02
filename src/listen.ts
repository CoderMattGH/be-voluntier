import { logger } from "./logger";
import { app } from "./app";

const { PORT = 9090 } = process.env;
const { IP_ADD = "127.0.0.1" } = process.env;

app.listen(Number(PORT), IP_ADD, () => {
  logger.info(`App listening on port ${PORT} @ ${IP_ADD}!`);
});
