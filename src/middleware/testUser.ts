import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
const TEST_USER_EMAIL = "testUser@test.com";
const testUserHandler = (
  { user: { email } }: Request,
  res: Response,
  next: NextFunction
) => {
  if (email === process.env.TEST_USER_EMAIL)
    throw new BadRequestError(`test user: read only!`);

  next();
};

export { testUserHandler };
