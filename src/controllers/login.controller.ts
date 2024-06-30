import * as volUserModel from "../models/vol-user.model";
import * as authUtils from "../auth/auth-utils";
import {Request, Response, NextFunction} from "express";

// TODO: Organiser and Admin roles
export function loginUser(req: Request, res: Response, next: NextFunction) : void {
  const email = req.body.email;
  const password = req.body.password;

  volUserModel.selectVolUserByEmail(email)
      .then((volUser) => {
        console.log("Trying to login!");

        if (authUtils.checkPassword(password, volUser.vol_password)) {
          console.log("Username and password OK!");

          // Attach user object to session
          req.session.user = {
            id: volUser.vol_id,
            email: volUser.vol_email,
            role: "volunteer"
          };

          res.status(200).send();
        } else {
          throw new Error("Incorrect username or password!");
        }
      })
      .catch((err) => {
        console.log("ERROR:", err);

        // TODO: next middleware
        res.status(500).send();
      });
}

// TODO: Error handling
export function logoutUser(req: Request, res: Response, next: NextFunction) : void {
  console.log("Trying to log out user!");

  if (req.session.user) {
    req.session.destroy(() => {
      console.log("Session destroyed!");

      // req.session.user = null;
      res.clearCookie('connect.sid');
      res.status(200).send();
    });
  } else {
    console.log("User was not logged in!");

    res.status(500).send();
  }
}