import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY!);

export async function inferFromImage(_buf: Buffer): Promise<{ dish?: string; items: { name: string; carbon_kg: number }[] }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
  Analyze this food image and return the dish name and a list of ingredients with their estimated carbon footprint in kg CO₂e per serving.
  `;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: _buf.toString("base64"), mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = result.response.text();
    const parsedResponse = JSON.parse(jsonText);

    // The key is to map the response to the correct format before returning it.
    // Assuming the Gemini response has "carbon_Kg"
    const formattedItems = parsedResponse.items.map((item: any) => ({
      name: item.name,
      carbon_kg: item.carbon_Kg, // Change from carbon_Kg to carbon_kg
    }));

    return {
      dish: parsedResponse.dish,
      items: formattedItems
    };
  } catch (error) {
    console.error("Failed to parse JSON from Gemini API:", error);
    throw new Error("Failed to process image inference. Please try again.");
  }
}