import rateLimit from "express-rate-limit";
import { env } from "../utils/env";

export const limiter = rateLimit({
  windowMs: 60_000,
  max: Number(env.RATE_LIMIT_PER_MINUTE || 5),
  standardHeaders: true,
  legacyHeaders: false,
});