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
  ingredients: z.array(Ingredient).min(1),
});

export type EstimateRequest = z.infer<typeof EstimateRequest>;
export type EstimateResponse = z.infer<typeof EstimateResponse>;