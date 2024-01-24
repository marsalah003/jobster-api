import { Model, Schema, model } from "mongoose";
import { genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";

interface IUser {
  name: string;
  password: string;
  email: string;
  lastName: string;
  location: string;
}
interface IUserMethods {
  generateToken: () => string;
  isPasswordValid: (candidatePassword: string) => Promise<boolean>;
}
type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "please enter a name"],
    maxlength: [50, "name too long "],
    minlength: [5, "name too short"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    maxlength: [100, "password too long "],
    minlength: [5, "password too short"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    trim: true,
    maxlength: [50, "email too long "],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
    unique: true,
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "my city",
  },
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

UserSchema.methods.generateToken = function () {
  const { JWT_LIFETIME, JWT_SECRET } = process.env;

  const token = sign(
    { userId: this._id, name: this.name },
    JWT_SECRET as string,
    {
      expiresIn: JWT_LIFETIME,
    }
  );
  return token;
};
UserSchema.methods.isPasswordValid = function (candidatePassword) {
  return compare(candidatePassword, this.password);
};

const User = model<IUser, UserModel>("User", UserSchema);
export { User };
