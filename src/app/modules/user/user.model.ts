import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    oldPassword: {
      type: String,
      select: false,
    },
    moreOldPassword: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

//using document pre middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt));
  this.oldPassword = this.password;
  this.moreOldPassword = this.password;
});

const User = model("User", userSchema);

export default User;
