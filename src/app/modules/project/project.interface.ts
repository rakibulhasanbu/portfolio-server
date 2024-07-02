import { Document } from "mongoose";

export interface TProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  images: string[];
}
