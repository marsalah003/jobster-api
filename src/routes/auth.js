"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var authentication_1 = require("../middleware/authentication");
var testUser_1 = require("../middleware/testUser");
var express_rate_limit_1 = require("express-rate-limit");
var apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
    message: {
        msg: "Too many requests to the server have been made, try again in 15 minutes",
    },
});
var router = (0, express_1.Router)();
exports.router = router;
router.route("/register").post(apiLimiter, auth_1.register);
router.route("/login").post(apiLimiter, auth_1.login);
router.route("/updateUser").patch(authentication_1.authHandler, testUser_1.testUserHandler, auth_1.updateUser);
