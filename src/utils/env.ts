require('dotenv').config();

export const env = {
  PORT: process.env.PORT,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  RATE_LIMIT_PER_MINUTE: process.env.RATE_LIMIT_PER_MINUTE,
  MAX_UPLOAD_MB: process.env.MAX_UPLOAD_MB,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
};
 
 