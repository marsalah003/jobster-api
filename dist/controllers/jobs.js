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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.deleteJob = exports.updateJob = exports.getSingleJob = exports.getAllJobs = exports.createJob = void 0;
const Job_1 = require("../models/Job");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const addMonths = (date, months) => {
    date.setMonth(date.getMonth() + months);
    return date;
};
const getStats = ({ user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield Job_1.Job.aggregate([
        { $match: { createdBy: new mongoose_1.Types.ObjectId(userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const { declined, interview, pending } = stats.reduce((acc, { _id: title, count }) => (Object.assign(Object.assign({}, acc), { [title]: count })), {});
    let monthlyApplications = yield Job_1.Job.aggregate([
        { $match: { createdBy: new mongoose_1.Types.ObjectId(userId) } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
    ]);
    monthlyApplications = monthlyApplications
        .map(({ _id: { year, month }, count }) => ({
        date: (0, moment_1.default)()
            .month(month - 1)
            .year(year)
            .format("MMM Y"),
        count,
    }))
        .reverse();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        defaultStats: {
            pending: pending || 0,
            declined: declined || 0,
            interview: interview || 0,
        },
        monthlyApplications,
    });
});
exports.getStats = getStats;
const createJob = ({ body, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.Job.create(Object.assign(Object.assign({}, body), { createdBy: userId }));
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ job });
});
exports.createJob = createJob;
const getAllJobs = ({ user: { userId }, query: { status, jobType, sort, page, search }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (status && status !== "all")
        query["status"] = status;
    if (jobType && jobType !== "all")
        query["jobType"] = jobType;
    if (search)
        query["position"] = { $regex: search, $options: "i" };
    const defaultLimit = 10;
    let sortingString;
    switch (sort) {
        case "oldest":
            sortingString = "createdAt";
            break;
        case "a-z":
            sortingString = "position";
            break;
        case "z-a":
            sortingString = "-position";
            break;
        default:
            sortingString = "-createdAt";
    }
    const skip = defaultLimit * (Number(page) - 1);
    const jobs = yield Job_1.Job.find(Object.assign({ createdBy: userId }, query))
        .sort(sortingString)
        .limit(defaultLimit)
        .skip(skip);
    const totalJobs = yield Job_1.Job.countDocuments(Object.assign({ createdBy: userId }, query));
    const numOfPages = Math.ceil(totalJobs / defaultLimit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ totalJobs: totalJobs, jobs, numOfPages });
});
exports.getAllJobs = getAllJobs;
const getSingleJob = ({ params: { id: jobId }, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here now");
    const job = yield Job_1.Job.findOne({ _id: jobId, createdBy: userId });
    if (!job)
        throw new errors_1.NotFoundError(`No job with id ${jobId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ job });
});
exports.getSingleJob = getSingleJob;
const updateJob = ({ body, user: { userId }, params: { id: jobId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, position } = body;
    if (!company || !position)
        throw new errors_1.BadRequestError("both company AND position must be provided");
    const updatedJob = yield Job_1.Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, Object.assign({}, body), {
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
    res.status(http_status_codes_1.StatusCodes.OK).send("The job has been deleted");
});
exports.deleteJob = deleteJob;
