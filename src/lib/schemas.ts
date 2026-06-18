import { z } from "zod";

export const ageSchema = z.coerce
  .number()
  .int()
  .min(10, "Age must be between 10 and 120")
  .max(120, "Age must be between 10 and 120");
export const heightSchema = z.coerce
  .number()
  .min(50, "Height must be between 50 and 300 cm")
  .max(300, "Height must be between 50 and 300 cm");
export const weightSchema = z.coerce
  .number()
  .min(10, "Weight must be between 10 and 700 kg")
  .max(700, "Weight must be between 10 and 700 kg");
export const bodyFatSchema = z.coerce
  .number()
  .min(3, "Body fat must be between 3% and 70%")
  .max(70, "Body fat must be between 3% and 70%")
  .optional();

const caloriesSchema = z.coerce.number().min(0, "Calories cannot be negative").max(10000, "Calories seems too high");
const proteinSchema = z.coerce.number().min(0, "Protein cannot be negative").max(1000, "Protein seems too high");
const carbsSchema = z.coerce.number().min(0, "Carbs cannot be negative").max(1000, "Carbs seems too high");
const fatSchema = z.coerce.number().min(0, "Fat cannot be negative").max(500, "Fat seems too high");

export const targetsSchema = z.object({
  calories: caloriesSchema,
  protein: proteinSchema,
  carbs: carbsSchema,
  fat: fatSchema,
});

export const mealRequestSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Meal name is required").max(160, "Meal name is too long"),
  date: z.string().min(1, "Meal date is required").max(80, "Meal date is too long"),
  calories: caloriesSchema,
  protein: proteinSchema,
  carbs: carbsSchema,
  fat: fatSchema,
  servingEstimate: z.string().max(240).default(""),
  items: z.array(z.string().max(120)).max(25).default([]),
  confidence: z.coerce.number().min(0).max(1),
  notes: z.string().max(1000).default(""),
  aiProvider: z.string().max(80).default("Groq"),
  editedByUser: z.boolean(),
});
