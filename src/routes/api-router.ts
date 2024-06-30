import { Router } from "express";
import { getEndpoints } from "../controllers/api.controller";
import { loginRouter } from "./login-router";
import { logoutRouter } from "./logout-router";

export const apiRouter = Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/login", loginRouter);
apiRouter.use("/logout", logoutRouter);
