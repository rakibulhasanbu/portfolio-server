import { Request, Response } from "express";
import { CatchAsyncError } from "../../utils/CatchAsyncError";
import { projectServices } from "./project.service";
import { blogService } from "../blog/blog.services";
import AppError from "../../error/AppError";

const createProject = CatchAsyncError(async (req: Request, res: Response) => {
  const project = req.body;
  project.createdBy = req.user._id;
  const result = await projectServices.createProject(project);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "project created successfully",
    data: result,
  });
});

const getAllProject = CatchAsyncError(async (req: Request, res: Response) => {
  const result = await projectServices.getAllProject(req.query);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Projects retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getProjectByIdWithReviews = CatchAsyncError(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const project = await projectServices.getSingleProjectById(projectId);
    if (!project) {
      throw new AppError(404, `${projectId} is not a valid project id!`);
    }

    const reviews = await blogService.getBlogByCourseID(projectId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Project with reviews retrieved successfully",
      data: { project, reviews },
    });
  },
);

const getBestProject = CatchAsyncError(async (req: Request, res: Response) => {
  const review = await blogService.highestBlogs();
  const project = await projectServices.getSingleProjectById(review?._id);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Best project retrieved successfully",
    data: {
      project,
      averageRating: review?.averageRating,
      reviewCount: review?.reviewCount,
    },
  });
});

const updateProject = CatchAsyncError(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const project = await projectServices.getSingleProjectById(projectId);
  if (!project) {
    throw new AppError(404, `${projectId} is not a valid project id!`);
  }

  const result = await projectServices.updateProject(projectId, req.body);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Project updated successfully",
    data: result,
  });
});

export const projectControllers = {
  createProject,
  getAllProject,
  getProjectByIdWithReviews,
  getBestProject,
  updateProject,
};
