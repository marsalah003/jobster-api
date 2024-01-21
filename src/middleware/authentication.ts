import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UnauthenticatedError } from "../errors";
import { User } from "../models/User";

type decodedShape = {
  userId: string;
  name: string;
};

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthenticatedError(
      "authorization key is not present for the request of information"
    );
  }
  const token = authorization?.split(" ")[1];
  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET as string
    ) as decodedShape;
    const { userId, name } = decoded;
    req.user = { userId, name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};
export { authHandler };
