import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { authValidations } from "./auth.validation";
import { authControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import USER_ROLE from "../user/user.const";

const authRoute = express.Router();

authRoute.post(
  "/login",
  validateRequest(authValidations.logInValidation),
  authControllers.loginUser,
);

authRoute.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(authValidations.changePasswordValidation),
  authControllers.changePassword,
);

export default authRoute;
