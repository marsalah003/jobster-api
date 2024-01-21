"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const jobs_1 = require("../controllers/jobs");
const router = (0, express_1.Router)();
exports.router = router;
router.route("/").post(jobs_1.createJob).get(jobs_1.getAllJobs);
router.route("/:id").get(jobs_1.getSingleJob).patch(jobs_1.updateJob).delete(jobs_1.deleteJob);
