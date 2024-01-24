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
require("yamljs");
// extra security packages
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
// import cors from "cors";
// import xss from "xss-clean";
// Swagger
// import swaggerUI from "swagger-ui-express";
// import YAML from "yamljs";
// const swaggerDocument = YAML.load("./swagger.yaml");
const express_1 = __importDefault(require("express"));
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const connect_1 = require("./db/connect");
const auth_1 = require("./routes/auth");
const jobs_1 = require("./routes/jobs");
const authentication_1 = require("./middleware/authentication");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use(express_1.default.static((0, path_1.resolve)(__dirname, "../src/client/build")));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
// make requests to our server from any ip address
// app.use(cors());
// sanitise the body, query params, params etc of the requests
// app.use(xss());
// Swagger
// app.get("/", (req: Request, res: Response) => {
//   res.send('<h1> Jobs API </h1> <a href="/api-docs"> Documentation </a> "');
// });
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
//auth routes
app.use("/api/v1/auth", auth_1.router);
// jobs routes
app.use("/api/v1/jobs", authentication_1.authHandler, jobs_1.router);
app.get("*", (req, res) => {
    res.sendFile((0, path_1.resolve)(__dirname, "../src/client/build", "index.html"));
});
//error handlers
app.use(error_handler_1.errorHandlerMiddleware);
app.use(not_found_1.notFound);
const port = process.env.PORT || 5000;
//starting server and db
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_1.connectDB)(process.env.MONGO_URI).catch((err) => console.log(err));
    console.log("The db is up and running...");
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
}))();
