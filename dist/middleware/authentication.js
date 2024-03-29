"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errors_1 = require("../errors");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        throw new errors_1.UnauthenticatedError("authorization key is not present for the request of information");
    }
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        const { userId, email } = decoded;
        req.user = { userId, email };
        next();
    }
    catch (error) {
        throw new errors_1.UnauthenticatedError("Not authorized to access this route");
    }
});
exports.authHandler = authHandler;
