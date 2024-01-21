import { Request, Response } from "express";
import { Job } from "../models/Job";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
const createJob = async (
  { body, user: { userId } }: Request,
  res: Response
) => {
  const job = await Job.create({ ...body, createdBy: userId });
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async ({ user: { userId } }: Request, res: Response) => {
  console.log(userId);
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getSingleJob = async (
  { params: { id: jobId }, user: { userId } }: Request,
  res: Response
) => {
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (
  {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  }: Request,
  res: Response
) => {
  if (!company || !position)
    throw new BadRequestError("both company AND position must be provided");

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedJob) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (
  { user: { userId }, params: { id: jobId } }: Request,
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
