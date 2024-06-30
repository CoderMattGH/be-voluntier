import { Express } from "express";
import pgSession from 'connect-pg-simple';
import db from "../db/connection";

// Role: volunteer, organiser, admin.
// TODO: Change role to Enum from String
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
function sessionInit(app: Express, session: any) {
  const pgOptions = {pool: db, tableName: 'session'};
  const sessionConfig = {
    store: new (pgSession(session))(pgOptions),
    secret: 'keyboard-cat',
    cookie: {secure: false},
    resave: true,
    saveUninitialized: false
  };

  app.use(session(sessionConfig));
}

export default sessionInit;
export type { UserSession };