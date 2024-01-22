import { Response } from "express";
import { Job } from "../models/Job";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

interface bodyI {
  company: string;
  position: string;
  status?: "interview" | "declined" | "pending";
}
interface userI {
  userId: string;
}

interface createJobI {
  body: bodyI;
  user: userI;
}
interface paramI {
  id: string;
}
interface getSingleJobI {
  user: userI;
  params: paramI;
}
interface updateJobI extends getSingleJobI {
  body: bodyI;
}
interface deleteJobI extends getSingleJobI {}

const createJob = async (
  { body, user: { userId } }: createJobI,
  res: Response
) => {
  const job = await Job.create({ ...body, createdBy: userId });
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (
  { user: { userId } }: { user: userI },
  res: Response
) => {
  console.log(userId);
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getSingleJob = async (
  { params: { id: jobId }, user: { userId } }: getSingleJobI,
  res: Response
) => {
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (
  { body, user: { userId }, params: { id: jobId } }: updateJobI,
  res: Response
) => {
  const { company, position } = body;
  if (!company || !position)
    throw new BadRequestError("both company AND position must be provided");

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { ...body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedJob) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (
  { user: { userId }, params: { id: jobId } }: deleteJobI,
  res: Response
) => {
  const deletedJob = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!deletedJob) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).send();
};

export { createJob, getAllJobs, getSingleJob, updateJob, deleteJob };
