import { Schema, model } from "mongoose";

import { TBlog } from "./blog.interface";

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
    },
    des: {
      type: String,
      maxlength: 200,
      // required: true
    },
    content: {
      type: [],
      // required: true
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Blog = model<TBlog>("Blog", blogSchema);

export default Blog;