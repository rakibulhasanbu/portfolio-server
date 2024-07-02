import express from "express";
import { projectControllers } from "./project.controller";
import { projectValidation } from "./project.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import USER_ROLE from "../user/user.const";

const projectRouter = express.Router();

projectRouter.post(
  "/project",
  auth(USER_ROLE.admin),
  validateRequest(projectValidation.projectValidationSchema),
  projectControllers.createProject,
);

projectRouter.get("/projects", projectControllers.getAllProject);

projectRouter.get(
  "/projects/:projectId/reviews",
  projectControllers.getProjectByIdWithReviews,
);

projectRouter.get("/project/best", projectControllers.getBestProject);

projectRouter.put(
  "/projects/:projectId",
  auth(USER_ROLE.admin),
  validateRequest(projectValidation.projectValidationSchema),
  projectControllers.updateProject,
);

export default projectRouter;
