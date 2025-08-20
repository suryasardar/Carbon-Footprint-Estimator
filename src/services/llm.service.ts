import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger";
import { env } from "../utils/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

export async function inferIngredientsFromDish(
  dish: string
): Promise<{ name: string }[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze the dish "${dish}".
If it is a valid food dish, return a JSON array of its main ingredients.
If it is NOT a valid food dish, return an empty JSON array [].
Respond only with the JSON.

Example JSON format for a valid dish:
[
  { "name": "rice" },
  { "name": "chicken" }
]

Example JSON format for an invalid dish:
[]
`;
 
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();

    // The LLM now returns an array of objects with only a 'name' key, or an empty array.
    return JSON.parse(text);
  } catch (err:any) {
    logger.error("Error fetching ingredients from Gemini:", err);
    return [];
  }
}
