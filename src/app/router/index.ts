import { Router } from "express";
import reviewRouter from "../modules/blog/blog.router";
import courseRouter from "../modules/project/project.router";
import categoryRoute from "../modules/comment/comment.route";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/",
    route: reviewRouter,
  },
  {
    path: "/",
    route: courseRouter,
  },
  {
    path: "/",
    route: categoryRoute,
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
