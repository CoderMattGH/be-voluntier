import {logger} from "./logger";
import {app} from './app';

const port = 9090;

app.listen(port, () => {
  logger.info(`App listening on port ${port}!`);
});