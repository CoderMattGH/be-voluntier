import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
import endpoints from "../../endpoints.json";

export function getEndpoints(req: Request, res: Response, next: NextFunction) {
  logger.debug("In getEndpoints() in api.controller");

  res.status(200).send(endpoints);
}
