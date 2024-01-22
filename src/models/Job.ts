import { Model, Schema, model, Types } from "mongoose";

interface IJob {
  company: string;
  position: string;
  status: "interview" | "declined" | "pending";
  createdBy: Types.ObjectId;
}
interface IJobMethods {}
type JobModel = Model<IJob, Record<string, never>, IJobMethods>;

const jobSchema = new Schema<IJob, JobModel, IJobMethods>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A Job must have a 'CreatedBy' attribute"],
    },
  },
  { timestamps: true }
);

const Job = model<IJob, JobModel>("Job", jobSchema);
export { Job };
