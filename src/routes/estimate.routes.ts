import { Router } from "express";
import multer from "multer";
import { validate } from "../middleware/validate";
import { EstimateRequest } from "../schemas/estimate.schema";
import { estimateFromDish } from "../controllers/estimate.controller";
import { estimateFromImage } from "../controllers/vision.controller";
import { env } from "../utils/env";

const router = Router();

router.post("/estimate", validate(EstimateRequest), estimateFromDish);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(env.MAX_UPLOAD_MB || 5) * 1024 * 1024 },
});

router.post("/estimate/image", upload.single("image"), estimateFromImage);

export { router };