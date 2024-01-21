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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getSingleJob = exports.getAllJobs = exports.createJob = void 0;
const Job_1 = require("../models/Job");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const createJob = ({ body, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.Job.create(Object.assign(Object.assign({}, body), { createdBy: userId }));
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ job });
});
exports.createJob = createJob;
const getAllJobs = ({ user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    const jobs = yield Job_1.Job.find({ createdBy: userId }).sort("createdAt");
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: jobs.length, jobs });
});
exports.getAllJobs = getAllJobs;
const getSingleJob = ({ params: { id: jobId }, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.Job.findOne({ _id: jobId, createdBy: userId });
    if (!job)
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ job });
});
exports.getSingleJob = getSingleJob;
const updateJob = ({ body: { company, position }, user: { userId }, params: { id: jobId }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!company || !position)
        throw new errors_1.BadRequestError("both company AND position must be provided");
    const updatedJob = yield Job_1.Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, { company, position }, {
        new: true,
        runValidators: true,
    });
    if (!updatedJob)
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ updatedJob });
});
exports.updateJob = updateJob;
const deleteJob = ({ user: { userId }, params: { id: jobId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedJob = yield Job_1.Job.findOneAndDelete({
        _id: jobId,
        createdBy: userId,
    });
    if (!deletedJob)
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    res.status(http_status_codes_1.StatusCodes.OK).send();
});
exports.deleteJob = deleteJob;
