"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var jobs_1 = require("../controllers/jobs");
var testUser_1 = require("../middleware/testUser");
var router = (0, express_1.Router)();
exports.router = router;
router.route("/stats").get(jobs_1.getStats);
router.route("/").post(testUser_1.testUserHandler, jobs_1.createJob).get(jobs_1.getAllJobs);
router
    .route("/:id")
    .get(jobs_1.getSingleJob)
    .patch(testUser_1.testUserHandler, jobs_1.updateJob)
    .delete(testUser_1.testUserHandler, jobs_1.deleteJob);
