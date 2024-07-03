import { Router } from "express";
import { getEndpoints } from "../controllers/api.controller";
import { loginRouter } from "../routes/login-router";
import { logoutRouter } from "../routes/logout-router";
import { listingsRouter } from "../routes/listings-router";
import { applicationsRouter } from "../routes/applications-router";
import { badgesRouter } from "../routes/badges-router";
import { leaderboardRouter } from "../routes/leaderboard-router";
import { orgUserRouter } from "../routes/org-user-router";
import { volUserRouter } from "../routes/vol-user-router";
import { skillsRouter } from "../routes/skills-router";
import { orgTypesRouter } from "../routes/org-types-router";
import { favouritesRouter } from "../routes/favourites-router";
import { imageRouter } from "./images-router";

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
apiRouter.use("/images", imageRouter);
