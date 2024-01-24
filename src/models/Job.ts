import { Model, Schema, model, Types } from "mongoose";

interface IJob {
  company: string;
  position: string;
  status: "interview" | "declined" | "pending";
  createdBy: Types.ObjectId;
  jobType: string;
  jobLocation: string;
}
interface IJobMethods {}
type JobModel = Model<IJob, Record<string, never>, IJobMethods>;

const jobSchema = new Schema<IJob, JobModel, IJobMethods>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Job = model<IJob, JobModel>("Job", jobSchema);
export { Job };
