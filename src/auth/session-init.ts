import { Express } from "express";

// Role: volunteer, organiser, admin.
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

// TODO: Change secret and private
function sessionInit(app: Express, session: Function) : void {
  const sessionConfig = {
    secret: 'keyboard-cat',
    cookie: {secure: false},
    resave: true,
    saveUninitialized: false
  };

  app.use(session(sessionConfig));
}

export default sessionInit;
export type { UserSession };