import { lookupCarbon } from "../utils/normalize";
import logger from "../utils/logger";

export function computeFootprint(
  dish: string,
  ingredients: { name: string }[] // Changed type to not expect carbon_kg from the input
) {
  try {
    if (!ingredients || ingredients.length === 0) {
    logger.info(`No ingredients found for dish '${dish}'. Returning 0 carbon footprint.`);
    return {
      dish,
      estimated_carbon_kg: 0,
      ingredients: [],
    };
  }

    const breakdown = ingredients.map((item) => ({
      name: item.name,
      // Now, lookup the carbon_kg value here using your own data
      carbon_kg: Number(lookupCarbon(item.name)),
    }));

    const totalCarbon = breakdown.reduce((acc, x) => {
      return acc + (Number(x.carbon_kg) || 0);
    }, 0);

    const estimated_carbon_kg = Number(totalCarbon.toFixed(2));

    return { dish, estimated_carbon_kg, ingredients: breakdown };
  } catch (error:any) {
    logger.error(`Error computing footprint for ${dish}:`, error);
    return {
      dish,
      estimated_carbon_kg: 0,
      ingredients:
        ingredients?.map((item) => ({
          name: item.name || "Unknown",
          carbon_kg: 0,
        })) || [],
    };
  }
}