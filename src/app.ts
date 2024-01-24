import "express-async-errors";
import dotenv from "dotenv";
import "yamljs";
// extra security packages
import helmet from "helmet";
import { basename, resolve } from "path";
import { Response, Request } from "express";
// import cors from "cors";
// import xss from "xss-clean";

// Swagger
// import swaggerUI from "swagger-ui-express";
// import YAML from "yamljs";
// const swaggerDocument = YAML.load("./swagger.yaml");

import express from "express";
import { notFound as notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { connectDB } from "./db/connect";
import { router as authRouter } from "./routes/auth";
import { router as jobsRouter } from "./routes/jobs";
import { authHandler } from "./middleware/authentication";
dotenv.config();
const app = express();
app.set("trust proxy", 1);
app.use(express.static(resolve(__dirname, "../src/client/build")));

app.use(express.json());
app.use(helmet());

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
app.use("/api/v1/auth", authRouter);

// jobs routes
app.use("/api/v1/jobs", authHandler, jobsRouter);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(resolve(__dirname, "../src/client/build", "index.html"));
});

//error handlers
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 4999;

//starting server and db
(async () => {
  await connectDB(process.env.MONGO_URI as string).catch((err) =>
    console.log(err)
  );
  console.log("The db is up and running...");
  app.listen(port, () => console.log(`Server is listening on port ${port}...`));
})();
