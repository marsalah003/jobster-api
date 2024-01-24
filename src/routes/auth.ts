import { Router } from "express";
import { login, register, updateUser } from "../controllers/auth";
import { authHandler } from "../middleware/authentication";
import { testUserHandler } from "../middleware/testUser";
import { rateLimit } from "express-rate-limit";
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
  message: {
    msg: "Too many requests to the server have been made, try again in 15 minutes",
  },
});
const router = Router();

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/updateUser").patch(authHandler, testUserHandler, updateUser);

export { router };
