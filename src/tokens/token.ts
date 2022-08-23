import jwt from "jsonwebtoken";
import redisClient from "../redisclient/redisClient";
import { Request, Response } from "express";

interface UserContents {
  name: string;
  email: string;
  password: string;
  id: string;
}

export const getAuthTokenId = (req: Request, res: Response) => {
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
  return res.json({ id: reply });
};

export const createSession = (user: UserContents) => {
  //JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(`Bearer ${token}`, id)
    .then(() => {
      return { success: true, userId: id, token, user };
    })
    .catch((err) => console.log(err));
};

const signToken = (email: string) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "7 days",
  });
};

const setToken = (key: string, value: string) =>
  Promise.resolve(redisClient.set(key, value));
