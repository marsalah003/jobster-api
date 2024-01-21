import { Router } from "express";
import {
  getAllJobs,
  createJob,
  deleteJob,
  getSingleJob,
  updateJob,
} from "../controllers/jobs";

const router = Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob);

export { router };
