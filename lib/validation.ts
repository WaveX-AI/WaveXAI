import { z } from "zod";
import { Industry, Sector, StartupStage } from "@/types";

export const startupFormSchema = z.object({
  name: z.string({
    required_error: "Please enter your name",
  }).min(2).max(50),
  email: z.string({
    required_error: "Please enter your email",
  }).email("Invalid email address"),
  startupName: z.string({
    required_error: "Please enter your startup name",
  }).min(2).max(50),
  industry: z.nativeEnum(Industry, {
    required_error: "Please select an industry",
  }),
  sector: z.nativeEnum(Sector, {
    required_error: "Please select a sector",
  }),
  stage: z.nativeEnum(StartupStage, {
    required_error: "Please select your startup stage",
  }),
  description: z.string({
    required_error: "Please provide a description",
  }).min(50, {
    message: "Description must be at least 50 characters",
  }).max(500, {
    message: "Description must not exceed 500 characters",
  }),
  capitalRequired: z.string({
    required_error: "Please enter the required capital",
  }),
});

export type StartupFormValues = z.infer<typeof startupFormSchema>;