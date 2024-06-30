import {app} from './app';
import {logger} from "./logger";

const port = 9090;

app.listen(port, () => {
  logger.info(`App listening on port ${port}!`);
});