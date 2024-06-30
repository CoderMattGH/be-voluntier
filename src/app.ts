import express from 'express';
import cors from 'cors';
import session from 'express-session';

import {apiRouter} from './routes/api-router';
import {sessionInit} from './auth/session-init';
import * as loginController from './controllers/login.controller';

const corsConfig = {
  origin: true,
  credentials: true
};

export const app = express();

sessionInit(app, session);
app.use(cors(corsConfig));
app.use(express.json());

app.use("/api", apiRouter);

// TODO: OK to delete.  Just for testing
app.get('/', (req, res, next) => {
  console.log("GET / Endpoint OK!");

  res.status(200).send();
});

// TODO: Move once routes setup
app.post('/api/login', loginController.loginUser);
app.get('/api/logout', loginController.logoutUser);

// TODO: Error handling middleware