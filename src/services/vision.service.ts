import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger";
import { env } from "../utils/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

export async function inferFromImage(
  _buf: Buffer
): Promise<{ dish?: string; items: { name: string }[] }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze this food image and return the dish name and a list of its main ingredients.
Respond strictly in this JSON format:

{
  "dish": "Dish Name",
  "items": [
    { "name": "Ingredient1" },
    { "name": "Ingredient2" }
  ]
}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: _buf.toString("base64"),
                mimeType: "image/jpeg",
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = result.response.text();

    try {
      // Attempt to parse the JSON. This is where the error is happening.
      const parsedResponse = JSON.parse(jsonText);

      const dish =
        parsedResponse.dish || parsedResponse.dishName || "Unknown Dish";

      let formattedItems: { name: string }[] = [];

      // Case 1: API returned `items: [{ name: ... }]`
      if (Array.isArray(parsedResponse.items)) {
        formattedItems = parsedResponse.items.map((item: any) => ({
          name: item.name,
        }));
      }

      // Case 2: API returned `mainIngredients: ["Rice", "Chicken"]`
      else if (Array.isArray(parsedResponse.mainIngredients)) {
        formattedItems = parsedResponse.mainIngredients.map(
          (ingredient: string) => ({
            name: ingredient,
          })
        );
      }

      return {
        dish,
        items: formattedItems,
      };
    } catch (parseError) {
      // This more specific catch block will tell you exactly what the response was.
      logger.error(
        `Failed to parse JSON from Gemini API. Additional details: ${JSON.stringify(
          {
            rawResponse: jsonText,
            parseError: parseError,
          }
        )}`
      );

      // Returning a default response to prevent a 500 error
      return { dish: undefined, items: [] };
    }
  } catch (error: any) {
    // This outer catch block handles other API-related errors (e.g., network issues, API key problems)
    logger.error(
      `An API error occurred: ${JSON.stringify({
        message: error.message,
        stack: error.stack,
      })}`
    );
    throw new Error("Failed to process image inference. Please try again.");
  }
}
