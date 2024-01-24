"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: [true, "please enter a name"],
        trim: true,
        maxlength: [60, "name too long "],
    },
    position: {
        type: String,
        required: [true, "please enter an email"],
        trim: true,
        maxlength: [60, "email too long "],
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A Job must have a 'CreatedBy' attribute"],
    },
    jobType: {
        type: String,
        enum: ["full-time", "part-time", "remote", "internship"],
        default: "full-time",
    },
    jobLocation: {
        type: String,
        default: "my city",
        required: true,
    },
}, { timestamps: true });
const Job = (0, mongoose_1.model)("Job", jobSchema);
exports.Job = Job;
