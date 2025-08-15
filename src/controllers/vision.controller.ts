import { Request, Response, NextFunction } from "express";
import { inferFromImage } from "../services/vision.service";
import { computeFootprint } from "../domain/calculator";
import { EstimateResponse } from "../schemas/estimate.schema";
import { setCache, getCache, imgCacheKey } from "../middleware/cache";

export async function estimateFromImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return res.status(400).json({ error: "image is required (multipart/form-data, field name 'image')" });

    const buf = req.file.buffer;
    const key = imgCacheKey(buf);
    const cached = getCache(key);
    if (cached) return res.json(cached);

    const { dish, items: ingredients } = await inferFromImage(buf);
    const result = EstimateResponse.parse(
      computeFootprint(dish ?? "Unknown dish", ingredients)
    );

    setCache(key, result, 60 * 60 * 24); // 24h
    res.json(result);
  } catch (err) {
    next(err);
  }
}