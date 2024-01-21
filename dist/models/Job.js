"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: [true, "please enter a name"],
        trim: true,
        maxlength: [20, "name too long "],
    },
    position: {
        type: String,
        required: [true, "please enter an email"],
        trim: true,
        maxlength: [20, "email too long "],
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
}, { timestamps: true });
const Job = (0, mongoose_1.model)("Job", jobSchema);
exports.Job = Job;
