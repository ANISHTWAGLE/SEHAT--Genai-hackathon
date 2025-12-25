import { GoogleGenAI } from "@google/genai";
import { Coordinates, GeminiResponse } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findNearbyHospitals = async (coords: Coordinates): Promise<GeminiResponse> => {
  try {
    const prompt = `
      I am currently located at latitude ${coords.latitude}, longitude ${coords.longitude}.
      
      Please find the nearest hospitals or emergency medical centers to my location.
      
      For the top 3-5 closest results, please provide:
      1. **Name** of the hospital. IMPORTANT: Append tags for phone (if available) AND coordinates: [[PHONE: +1-555-0123]] [[COORDS: 12.345,-67.890]]
      2. **Approximate Distance** (and travel time if available).
      3. **Key Facilities**: Does it have an Emergency Room (ER), ICU, Trauma Center, or specific specializations?
      4. **Status**: Is it currently open? (If available).

      CRITICAL INSTRUCTION FOR DATA PARSING:
      After the details for each hospital, you MUST include a separate line with the exact coordinates and phone number in this specific JSON format:
      __COORD_DATA__:{"name": "Exact Hospital Name", "lat": 12.3456, "lng": -78.9012, "phone": "+15550123"}
      
      Format the visible response clearly with bold headers for each hospital (e.g. ## Hospital Name [[PHONE: ...]] [[COORDS: ...]]). Use bullet points for details.
      
      Use Google Maps data to ensure location accuracy and correct phone numbers.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Maps Grounding is primary for this use case, Search is secondary
        tools: [
          { googleMaps: {} },
          { googleSearch: {} }
        ],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        },
        systemInstruction: "You are a helpful emergency assistant. Provide accurate locations and contact numbers. Always include the __COORD_DATA__ line for every hospital found.",
      },
    });

    const text = response.text || "No details found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch hospital data. Please try again.");
  }
};