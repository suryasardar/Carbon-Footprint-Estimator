import { Request, Response, NextFunction } from "express";
import { inferIngredientsFromDish } from "../services/llm.service";
import { computeFootprint } from "../domain/calculator";
import { EstimateResponse } from "../schemas/estimate.schema";
import { getCache, setCache } from "../middleware/cache";
import { canonical } from "../utils/normalize";

export async function estimateFromDish(req: Request, res: Response, next: NextFunction) {
  try {
    const dish: string = req.body.dish;
    const key = `dish:${canonical(dish)}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);

    const ingredients = await inferIngredientsFromDish(dish);
    const result = EstimateResponse.parse(computeFootprint(dish, ingredients));

    setCache(key, result, 60 * 60 * 24); // 24h
    res.json(result);
  } catch (err) {
    next(err);
  }
}