import { logger } from "../logger";

import { Express } from "express";
import pgSession from "connect-pg-simple";
import { db } from "../db";

// Role: volunteer, organisation, admin.
type UserSession = {
  id: number;
  email: string;
  role: string;
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: UserSession | null;
  }
}

// TODO: Change from session: any
// TODO: Change and private secret
export function sessionInit(app: Express, session: any) {
  logger.info("Initialising user session!");

  const pgOptions = { pool: db, tableName: "session" };
  const sessionConfig = {
    store: new (pgSession(session))(pgOptions),
    secret: "keyboard-cat",
    cookie: { secure: false },
    resave: true,
    saveUninitialized: false,
  };

  app.use(session(sessionConfig));
}

export type { UserSession };
