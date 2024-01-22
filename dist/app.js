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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
// extra security packages
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import xss from "xss-clean";
const express_rate_limit_1 = require("express-rate-limit");
const express_1 = __importDefault(require("express"));
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const connect_1 = require("./db/connect");
const auth_1 = require("./routes/auth");
const jobs_1 = require("./routes/jobs");
const authentication_1 = require("./middleware/authentication");
dotenv_1.default.config();
const app = (0, express_1.default)();
//security middlware
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
});
app.use(limiter);
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// app.use(xss());
app.get("/", (req, res) => {
    res.send("jobs api");
});
//auth routes
app.use("/api/v1/auth", auth_1.router);
// jobs routes
app.use("/api/v1/jobs", authentication_1.authHandler, jobs_1.router);
//error handlers
app.use(error_handler_1.errorHandlerMiddleware);
app.use(not_found_1.notFound);
const port = process.env.PORT || 3000;
//starting server and db
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_1.connectDB)(process.env.MONGO_URI).catch((err) => console.log(err));
    console.log("The db is up and running...");
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
}))();
