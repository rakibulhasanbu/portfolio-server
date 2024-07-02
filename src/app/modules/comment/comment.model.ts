import { Schema, model } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>(
  {
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    isReply: {
      type: Boolean,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true },
);

const Comment = model("Comment", commentSchema);

export default Comment;
