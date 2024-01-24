import { Router } from "express";
import {
  getAllJobs,
  createJob,
  deleteJob,
  getSingleJob,
  updateJob,
  getStats,
} from "../controllers/jobs";
import { testUserHandler } from "../middleware/testUser";

const router = Router();

router.route("/stats").get(getStats);
router.route("/").post(testUserHandler, createJob).get(getAllJobs);
router
  .route("/:id")
  .get(getSingleJob)
  .patch(testUserHandler, updateJob)
  .delete(testUserHandler, deleteJob);

export { router };
