import "express-async-errors";
import dotenv from "dotenv";
import { Request, Response } from "express";
// extra security packages
import helmet from "helmet";
import cors from "cors";
// import xss from "xss-clean";
import { rateLimit } from "express-rate-limit";

import express from "express";
import { notFound as notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { connectDB } from "./db/connect";
import { router as authRouter } from "./routes/auth";
import { router as jobsRouter } from "./routes/jobs";
import { authHandler } from "./middleware/authentication";
dotenv.config();
const app = express();

//security middlware
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
// app.use(xss());

app.get("/", (req: Request, res: Response) => {
  res.send("jobs api");
});

//auth routes
app.use("/api/v1/auth", authRouter);

// jobs routes
app.use("/api/v1/jobs", authHandler, jobsRouter);

//error handlers
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

//starting server and db
(async () => {
  await connectDB(process.env.MONGO_URI as string).catch((err) =>
    console.log(err)
  );
  console.log("The db is up and running...");
  app.listen(port, () => console.log(`Server is listening on port ${port}...`));
})();
