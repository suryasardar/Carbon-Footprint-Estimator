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
    console.log(buf);
    const cached = await getCache(key);
    console.log("cache hit for", key, cached);
    if (cached) return res.json(cached);

    // Call the vision service to infer details from the image.
    const inferenceResult = await inferFromImage(buf);

    // --- FIX: Check for the 'message' property to handle non-food images or errors. ---
    if ("message" in inferenceResult) {
      // If the result contains a message, it means the image was not food or an error occurred.
      // Return a 400 Bad Request status with the message to the client.
      return res.status(400).json({ error: inferenceResult.message });
    }

    // Now it's safe to destructure the result because we've confirmed it's a food-related response.
    const { dish, items: ingredients } = inferenceResult;

    const result = EstimateResponse.parse(
      computeFootprint(dish ?? "Unknown dish", ingredients)
    );

    setCache(key, result, 60 * 60 * 24); // 24h
    res.json(result);
  } catch (err) {
    next(err);
  }
}
