import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { router as estimateRouter } from "./routes/estimate.routes";
import { limiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/error";
import { env } from "./utils/env";
import cors from "cors";
 
const app = express();

app.use(helmet());
app.use(cors({
  origin: (env.CORS_ORIGINS || "").split(",").filter(Boolean),
}));
app.use(express.json({ limit: "256kb" }));
app.use(pinoHttp());
app.use(limiter);

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.use(estimateRouter);

app.use(errorHandler);

export default app;