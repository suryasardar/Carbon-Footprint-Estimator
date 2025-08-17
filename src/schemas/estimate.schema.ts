import { z } from "zod";

export const EstimateRequest = z.object({
  dish: z.string().min(1).max(120),
});

export const Ingredient = z.object({
  name: z.string(),
  carbon_kg: z.number().nonnegative(),
});

export const EstimateResponse = z.object({
  dish: z.string(),
  estimated_carbon_kg: z.number().nonnegative(),
  // Change the schema to allow the ingredients array to be empty.
  ingredients: z.array(Ingredient),
});

export type EstimateRequest = z.infer<typeof EstimateRequest>;
export type EstimateResponse = z.infer<typeof EstimateResponse>;