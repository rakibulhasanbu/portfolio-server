import config from "../../config";
import AppError from "../../error/AppError";
import User from "../user/user.model";
import { TChangePassword, TLogIn } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const loginUserIntoDB = async (payload: TLogIn) => {
  //checking if the user is exists
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(404, `${payload.email} user not found!`);
  }
  //checking if the password is matched
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(404, `${payload.password} is not correct!`);
  }
  const jwtPayload = {
    _id: user?._id,
    role: user?.role,
    email: user?.email,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1d",
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: accessToken,
  };
};

const changePasswordIntoDB = async (
  payload: TChangePassword,
  userData: JwtPayload,
) => {
  const user = await User.findById(userData?._id).select(
    "+password +oldPassword +moreOldPassword",
  );
  if (!user) {
    throw new AppError(401, `Your provided Token is not valid user!`);
  }

  if (payload.currentPassword === payload.newPassword) {
    return null;
  }

  //checking if the current password is matched
  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );
  if (!isPasswordMatched) {
    return null;
  }

  const isMatchWithOldPassword = await bcrypt.compare(
    payload.newPassword,
    user?.oldPassword,
  );
  const isMatchWithMoreOldPassword = await bcrypt.compare(
    payload.newPassword,
    user?.moreOldPassword,
  );

  if (isMatchWithOldPassword || isMatchWithMoreOldPassword) {
    return null;
  }

  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt),
  );

  return await User.findByIdAndUpdate(
    userData?._id,
    {
      password: hashPassword,
      oldPassword: user?.password,
      moreOldPassword: user?.oldPassword,
    },
    { new: true },
  );
};

export const authServices = { loginUserIntoDB, changePasswordIntoDB };
