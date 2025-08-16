import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger";
import { env } from "../utils/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

export async function inferIngredientsFromDish(
  dish: string
): Promise<{ name: string }[]> { // Change return type to not include carbon_kg
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the dish "${dish}" and return a JSON array of its main ingredients. Respond only with the JSON.

  Example JSON format:
  [
    { "name": "rice" },
    { "name": "chicken" }
  ]
  `;
console.log("called");
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    // The LLM now returns an array of objects with only a 'name' key
    return JSON.parse(text);
  } catch (err:any) {
    logger.error("Error fetching ingredients from Gemini:", err);
    return [];
  }
}