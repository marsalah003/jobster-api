import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
const TEST_USER_ID = "65af57ceb6ccff677e0e4f8c";
const testUserHandler = (
  { user: { userId } }: Request,
  res: Response,
  next: NextFunction
) => {
  if (userId === TEST_USER_ID)
    throw new BadRequestError(`test user: read only!`);

  next();
};

export { testUserHandler };
