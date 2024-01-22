import { Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { User } from "../models/User";

import { StatusCodes } from "http-status-codes";

interface registerBodyI {
  name: string;
  password: string;
  email: number;
}
interface loginBodyI extends Omit<registerBodyI, "name"> {}

const register = async (
  { body: { name, password, email } }: { body: registerBodyI },
  res: Response
) => {
  const user = await User.create({ name, password, email });

  const token = user.generateToken();

  res.status(StatusCodes.CREATED).json({ token, user: { name: user.name } });
};

const login = async (
  { body: { email, password } }: { body: loginBodyI },
  res: Response
) => {
  if (!email || !password)
    throw new BadRequestError("both email and password must be provided");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("email doesent exist");

  const passwordValid = await user.isPasswordValid(password);

  if (!passwordValid) throw new UnauthenticatedError("password is incorrect");

  const token = user.generateToken();

  res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

export { login, register };
