import { z } from "zod";

const projectValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    technologies: z.array(z.string().trim().min(1, "Technology is required")),
    link: z.string().trim().url("Link must be a valid URL"),
    repository: z.string().trim().url("Repository must be a valid URL"),
    startDate: z
      .string()
      .refine(
        (date) => !isNaN(Date.parse(date)),
        "Start date must be a valid date",
      ),
    endDate: z
      .string()
      .optional()
      .refine(
        (date) => date === undefined || !isNaN(Date.parse(date)),
        "End date must be a valid date",
      ),
    isActive: z.boolean().default(true),
    images: z.array(z.string().url("Image must be a valid URL")).optional(),
  }),
});

export const projectValidation = { projectValidationSchema };
