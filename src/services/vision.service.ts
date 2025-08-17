import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger";
import { env } from "../utils/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

export async function inferFromImage(
  _buf: Buffer
): Promise<{ dish?: string; items: { name: string }[] } | { message: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze this image. If the image contains a food dish, return a JSON object with the dish name and a list of its main ingredients.

If the image does NOT contain a food dish, return a plain JSON object with an empty message. This is the only response you should give for a non-food image.

Respond strictly in one of these two JSON formats:

Format 1 (if food is present):
{
  "dish": "Dish Name",
  "items": [
    { "name": "Ingredient1" },
    { "name": "Ingredient2" }
  ]
}

Format 2 (if food is NOT present):
{
  "message": "The provided image does not contain food. Please upload an image of a food dish."
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
      // Attempt to parse the JSON.
      const parsedResponse = JSON.parse(jsonText);

      // Check for the specific "not food" response.
      if (parsedResponse.message) {
        return { message: parsedResponse.message };
      }

      // If the response indicates food, process it as before.
      const dish = parsedResponse.dish || "Unknown Dish";
      let formattedItems: { name: string }[] = [];

      // Case 1: API returned `items: [{ name: ... }]`
      if (Array.isArray(parsedResponse.items)) {
        formattedItems = parsedResponse.items.map((item: any) => ({
          name: item.name,
        }));
      }
      // Case 2: Handle a different key if the model sometimes returns it
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
      // This catch block handles cases where the model response is not valid JSON.
      logger.error(
        `Failed to parse JSON from Gemini API. Additional details: ${JSON.stringify(
          {
            rawResponse: jsonText,
            parseError: parseError,
          }
        )}`
      );

      // Return a default, user-friendly message for a parse error.
      return { message: "Could not process the image. Please try again." };
    }
  } catch (error: any) {
    // This outer catch block handles other API-related errors.
    logger.error(
      `An API error occurred: ${JSON.stringify({
        message: error.message,
        stack: error.stack,
      })}`
    );
    return {
      message: "Failed to process image inference due to an API error.",
    };
  }
}
