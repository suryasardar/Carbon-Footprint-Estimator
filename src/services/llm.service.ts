import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY!);

export async function inferIngredientsFromDish(dish: string): Promise<{ name: string; carbon_kg: number }[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the dish "${dish}" and return a JSON array of its main ingredients, with each ingredient's estimated carbon footprint in kg CO₂e per serving. Respond only with the JSON.

  Example JSON format:
  [
    { "name": "rice", "carbon_kg": 0.05 },
    { "name": "chicken", "carbon_kg": 2.7 }
  ]
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = result.response.text();
    return JSON.parse(text);

  } catch (err) {
    console.error("Error fetching ingredients and carbon footprint from Gemini:", err);
    // Return an empty array on error to prevent application crash
    return [];
  }
}