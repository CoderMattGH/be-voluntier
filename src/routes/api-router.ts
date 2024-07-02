import { Router } from "express";
import { getEndpoints } from "../controllers/api.controller";
import { loginRouter } from "./login-router";
import { logoutRouter } from "./logout-router";
import { listingsRouter } from "./listings-router";
import { applicationsRouter } from "./applications-router";
import { badgesRouter } from "./badges-router";
import { leaderboardRouter } from "./leaderboard-router";
import { orgUserRouter } from "./org-user-router";
import { volUserRouter } from "./vol-user-router";
import { skillsRouter } from "./skills-router";
import { orgTypesRouter } from "./org-types-router";
import { favouritesRouter } from "./favourites-router";

export const apiRouter = Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/login", loginRouter);
apiRouter.use("/logout", logoutRouter);
apiRouter.use("/listings", listingsRouter);
apiRouter.use("/applications", applicationsRouter);
apiRouter.use("/badges", badgesRouter);
apiRouter.use("/leaderboard", leaderboardRouter);
apiRouter.use("/org", orgUserRouter);
apiRouter.use("/vol", volUserRouter);
apiRouter.use("/skills", skillsRouter);
apiRouter.use("/org-types", orgTypesRouter);
apiRouter.use("/favourites", favouritesRouter);
