import { Request, Response } from "express";
import { CatchAsyncError } from "../../utils/CatchAsyncError";
import { userServices } from "./user.service";
import sendRes from "../../utils/sendResponse";

const registerUser = CatchAsyncError(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await userServices.registerUserIntoDB(userData);

  //remove password from result
  const removePassResult = {
    ...result.toObject(),
    password: undefined,
    oldPassword: undefined,
    moreOldPassword: undefined,
  };

  sendRes(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: removePassResult,
  });
});

export const userControllers = {
  registerUser,
};
