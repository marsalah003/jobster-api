import { Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { User } from "../models/User";

import { StatusCodes } from "http-status-codes";
import { stat } from "fs";

interface registerBodyI {
  name: string;
  password: string;
  email: number;
}
interface userI {
  userId: string;
}
interface updateUserBodyI {
  name: string;
  lastName: string;
  location: string;
  email: string;
}
interface updateUserI {
  body: updateUserBodyI;
  user: userI;
}
interface loginBodyI extends Omit<registerBodyI, "name"> {}
const updateUser = async (
  { user: { userId }, body: { name, lastName, email, location } }: updateUserI,
  res: Response
) => {
  if (!email || !name || !lastName || !location)
    throw new BadRequestError("please provide all values when updating a user");
  const user = (await User.findOne({ _id: userId }))!;

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.generateToken();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const register = async (
  { body: { name, password, email } }: { body: registerBodyI },
  res: Response
) => {
  const user = await User.create({
    name,
    password,
    email,
  });
  const { lastName, location } = user;

  const token = user.generateToken();
  res.status(StatusCodes.CREATED).json({
    user: { email, lastName, location, name, token },
  });
};

const login = async (
  { body: { email, password } }: { body: loginBodyI },
  res: Response
) => {
  if (!email || !password)
    throw new BadRequestError("both email and password must be provided");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("Could not find email");

  const passwordValid = await user.isPasswordValid(password);

  if (!passwordValid) throw new UnauthenticatedError("password is incorrect");

  const token = user.generateToken();
  const { lastName, location, name } = user;

  res.status(StatusCodes.OK).json({
    user: { email, lastName, location, name, token },
  });
};

export { login, register, updateUser };
