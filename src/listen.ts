import { app } from './app';

const port = 9090;

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});