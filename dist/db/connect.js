"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const connectDB = (url) => {
    return (0, mongoose_1.connect)(url);
};
exports.connectDB = connectDB;
