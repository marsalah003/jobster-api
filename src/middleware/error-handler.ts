import { StatusCodes } from "http-status-codes";
import { ErrorRequestHandler } from "express";

interface errorObject {
  message: string;
}
const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  const customError = {
    StatusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong, try again later`,
  };
  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.StatusCode = StatusCodes.NOT_FOUND;
  }
  if (err.name === "ValidationError") {
    const obj: errorObject[] = Object.values(err.errors);

    customError.msg = obj.map((item) => item.message).join(", ");
    customError.StatusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.StatusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.StatusCode).json({ msg: customError.msg });
};

export { errorHandlerMiddleware };
