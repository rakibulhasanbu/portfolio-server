import AppError from "../../error/AppError";
import Comment from "../comment/comment.model";
import { TProject } from "./project.interface";
import Project from "./project.model";

const createProject = async (project: TProject) => {
  const isCommentIdValid = await Comment.findById(project);
  if (!isCommentIdValid) {
    throw new AppError(400, `${project} is not a valid Comment ID!`);
  }
  return await Project.create(project);
};

const getAllProject = async (query: Record<string, unknown>) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    title,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = query;

  const searchOptions: Record<string, unknown> = {};

  if (language) {
    searchOptions.language = language;
  }
  if (provider) {
    searchOptions.provider = provider;
  }
  if (durationInWeeks) {
    searchOptions.durationInWeeks = durationInWeeks;
  }
  if (level) {
    searchOptions["description.level"] = level;
  }
  if (title) {
    searchOptions["title.name"] = title;
  }
  if (startDate && endDate) {
    searchOptions.startDate = { $gte: startDate, $lte: endDate };
  }
  if (minPrice && maxPrice) {
    searchOptions.price = { $gte: minPrice, $lte: maxPrice };
  }
  let sortOptions = {};
  if (sortBy) {
    sortOptions = { [sortBy as string]: 1 };
  }
  if (sortOrder === "asc" || sortOrder === "desc") {
    sortOptions = sortOrder === "asc" ? { createdAt: 1 } : { createdAt: -1 };
  }
  const skip = (Number(page) - 1) * Number(limit);
  const result = await Project.find(searchOptions)
    .populate("createdBy")
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .exec();

  const total = await Project.countDocuments(searchOptions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      projects: result,
    },
  };
};

const getSingleProjectById = async (projectId: string) => {
  return await Project.findById(projectId).populate({
    path: "createdBy",
    select: "_id name email role",
  });
};

const updateProject = async (id: string, payload: Partial<TProject>) => {
  const { title, description, ...remainingData } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingData };

  if (title && Object.keys(title).length) {
    for (const [key, value] of Object.entries(title)) {
      modifiedData[`title.${key}`] = value;
    }
  }
  if (description && Object.keys(description).length) {
    for (const [key, value] of Object.entries(description)) {
      modifiedData[`description.${key}`] = value;
    }
  }

  return await Project.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "createdBy",
    select: "_id name email role",
  });
};

export const projectServices = {
  createProject,
  getAllProject,
  getSingleProjectById,
  updateProject,
};
