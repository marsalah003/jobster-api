import { Response, Request } from "express";

import { Job } from "../models/Job";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import { Types } from "mongoose";
import {} from "mongoose";
import moment from "moment";
import { Stats, statSync } from "fs";
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
interface getAllJobsI {
  user: { userId: string };
  query: {
    status: "interview" | "declined" | "pending" | "all";
    jobType: "full-time" | "part-time" | "remote" | "internship" | "all";
    sort: string;
    page: string;
    search?: string;
  };
}
interface queryI {
  status?: "interview" | "declined" | "pending" | "all";
  jobType?: "full-time" | "part-time" | "remote" | "internship" | "all";
  position?: { $regex: string; $options: "i" };
}
interface formatedStatsI {
  pending?: number;
  interview?: number;
  declined?: number;
}
interface defaultStatsI {
  interview?: number;
  declined?: number;
  pending?: number;
}
const addMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() + months);
  return date;
};

const getStats = async ({ user: { userId } }: Request, res: Response) => {
  const stats = await Job.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const { declined, interview, pending } = stats.reduce(
    (acc, { _id: title, count }) => ({ ...acc, [title]: count }),
    {}
  ) as defaultStatsI;

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
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
      date: moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y"),
      count,
    }))
    .reverse();
  res.status(StatusCodes.OK).json({
    defaultStats: {
      pending: pending || 0,
      declined: declined || 0,
      interview: interview || 0,
    },
    monthlyApplications,
  });
};

const createJob = async (
  { body, user: { userId } }: createJobI,
  res: Response
) => {
  const job = await Job.create({ ...body, createdBy: userId });
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (
  {
    user: { userId },
    query: { status, jobType, sort, page, search },
  }: getAllJobsI,
  res: Response
) => {
  const query: queryI = {};

  if (status && status !== "all") query["status"] = status;
  if (jobType && jobType !== "all") query["jobType"] = jobType;
  if (search) query["position"] = { $regex: search, $options: "i" };

  const defaultLimit = 10;

  let sortingString: string;

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

  const jobs = await Job.find({ createdBy: userId, ...query })
    .sort(sortingString)
    .limit(defaultLimit)
    .skip(skip);

  const totalJobs = await Job.countDocuments({ createdBy: userId, ...query });

  const numOfPages = Math.ceil(totalJobs / defaultLimit);
  res.status(StatusCodes.OK).json({ totalJobs: totalJobs, jobs, numOfPages });
};

const getSingleJob = async (
  { params: { id: jobId }, user: { userId } }: getSingleJobI,
  res: Response
) => {
  console.log("here now");
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

  res.status(StatusCodes.OK).send("The job has been deleted");
};

export { createJob, getAllJobs, getSingleJob, updateJob, deleteJob, getStats };
