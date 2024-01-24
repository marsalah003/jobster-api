import { Job } from "./models/Job";
import { config } from "dotenv";
config();

import data from "./MOCK_DATA";
import { connectDB } from "./db/connect";
(async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    await Job.deleteMany();
    await Job.create(data);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
