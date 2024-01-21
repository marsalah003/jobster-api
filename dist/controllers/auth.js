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
exports.register = exports.login = void 0;
const errors_1 = require("../errors");
const User_1 = require("../models/User");
const http_status_codes_1 = require("http-status-codes");
const register = ({ body: { name, password, email } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.create({ name, password, email });
    const token = user.generateToken();
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ token, user: { name: user.name } });
});
exports.register = register;
const login = ({ body: { email, password } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password)
        throw new errors_1.BadRequestError("both email and password must be provided");
    const user = yield User_1.User.findOne({ email });
    if (!user)
        throw new errors_1.UnauthenticatedError("email doesent exist");
    const passwordValid = yield user.isPasswordValid(password);
    if (!passwordValid)
        throw new errors_1.UnauthenticatedError("password is incorrect");
    const token = user.generateToken();
    res.status(http_status_codes_1.StatusCodes.OK).json({ token, user: { name: user.name } });
});
exports.login = login;
