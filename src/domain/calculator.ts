import {lookupCarbon} from "../utils/normalize";


export function computeFootprint(
  dish: string,
  ingredients: { name: string; carbon_kg: number }[]
) {
  try {
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided");
    }

    const breakdown = ingredients.map((item) => ({
      name: item.name,
      carbon_kg: lookupCarbon(item.name), // Use the lookupCarbon function here
    }));

    const estimated_carbon_kg = Number(
      breakdown.reduce((acc, x) => acc + x.carbon_kg, 0).toFixed(2)
    );

    return { dish, estimated_carbon_kg, ingredients: breakdown };
  } catch (error) {
    console.error(`Error computing footprint for ${dish}:`, error);
    return {
      dish,
      estimated_carbon_kg: 0,
      ingredients: ingredients?.map((item) => ({
        name: item.name || "Unknown",
        carbon_kg: 0,
      })) || [],
    };
  }
}