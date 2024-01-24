"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    const customError = {
        StatusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || `Something went wrong, try again later`,
    };
    if (err.name === "CastError") {
        customError.msg = `No item found with id ${err.value}`;
        customError.StatusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    if (err.name === "ValidationError") {
        const obj = Object.values(err.errors);
        customError.msg = obj.map((item) => item.message).join(", ");
        customError.StatusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.StatusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    return res.status(customError.StatusCode).json({ msg: customError.msg });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
