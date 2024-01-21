import { StatusCodes } from "http-status-codes";
import { ErrorRequestHandler } from "express";

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const customError = {
    StatusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong, try again later`,
  };
  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.StatusCode = StatusCodes.NOT_FOUND;
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
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
