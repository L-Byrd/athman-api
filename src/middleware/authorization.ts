import { Request, Response, NextFunction } from "express";
import redisClient from "../redisclient/redisClient";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  const reply = redisClient.get(authorization).catch((err: Error) => {
    return res.status(401).json("Unauthorized");
  });
  if (!reply) {
    return res.status(401).json("Unauthorized");
  }
  return next();
};

export default requireAuth;
