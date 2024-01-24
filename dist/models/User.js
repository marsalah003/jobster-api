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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_2 = require("bcryptjs");
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        const salt = yield (0, bcryptjs_1.genSalt)(10);
        this.password = yield (0, bcryptjs_1.hash)(this.password, salt);
    });
});
UserSchema.methods.generateToken = function () {
    const { JWT_LIFETIME, JWT_SECRET } = process.env;
    const token = (0, jsonwebtoken_1.sign)({ userId: this._id, name: this.email }, JWT_SECRET, {
        expiresIn: JWT_LIFETIME,
    });
    return token;
};
UserSchema.methods.isPasswordValid = function (candidatePassword) {
    return (0, bcryptjs_2.compare)(candidatePassword, this.password);
};
const User = (0, mongoose_1.model)("User", UserSchema);
exports.User = User;
