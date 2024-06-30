import "./env-parser";
import { logger } from "./logger";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";

import { apiRouter } from "./routes/api-router";
import { sessionInit } from "./auth/session-init";

import { CustomReqError } from "./types";

const corsConfig = {
  origin: true,
  credentials: true,
};

export const app = express();

sessionInit(app, session);
app.use(cors(corsConfig));
app.use(express.json());

app.use("/api", apiRouter);

// Handle psql errors
app.use(
  (
    err: NodeJS.ErrnoException,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    logger.debug(`In psql error handler!`);

    if (
      err.code === "22P02" ||
      err.code === "23502" ||
      err.code === "2201X" ||
      err.code === "2201W"
    ) {
      res.status(400).send({ msg: "Bad request!" });
    }
    else if (err.code === "23503") {
      // Violates Foreign Key constraint
      res.status(404).send({ msg: "Resource not found!" });
    }
    else if (err.code === "23505") {
      // Duplicate Primary Key found
      res.status(409).send({ msg: "Resource already exists!" });
    }
    else {
      next(err);
    }
  }
);

// Handle misc errors
app.use(
  (
    err: CustomReqError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    logger.debug(`In misc. error handler!`);

    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
    else next(err);
  }
);
