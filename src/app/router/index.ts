import { Router } from "express";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";
import projectRouter from "../modules/project/project.router";
import commentRoute from "../modules/comment/comment.route";
import blogRouter from "../modules/blog/blog.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/",
    route: projectRouter,
  },
  {
    path: "/",
    route: commentRoute,
  },
  {
    path: "/",
    route: blogRouter,
  },
  {
    path: "/auth",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
