
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFarmingAdvice = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide expert poultry farming advice on the following topic: ${topic}. Focus on practical, sustainable, and high-yield methods for local farmers.`,
      config: {
        systemInstruction: "You are a world-class poultry consultant specializing in tropical and subtropical climates.",
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate advice at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI consultant.";
  }
};

export const diagnoseDisease = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Symptoms reported by farmer: ${symptoms}. Provide a preliminary analysis of potential poultry diseases, recommended immediate actions (biosecurity), and suggest if a vet visit is urgent.`,
      config: {
        systemInstruction: "You are an avian veterinarian assistant. Provide safe, cautious advice and always emphasize consulting a local professional.",
        temperature: 0.2,
      }
    });
    return response.text || "Diagnosis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error diagnosing symptoms.";
  }
};

export const getDailyTip = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, actionable daily tip for poultry farmers (1-2 sentences).",
      config: {
        systemInstruction: "Keep it brief and highly practical.",
      }
    });
    return response.text || "Check your waterers daily for cleanliness!";
  } catch (error) {
    return "Keep your coop clean and ventilated.";
  }
};

export const generateVaccineSchedule = async (birdType: string, currentAgeWeeks: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a vaccination schedule for ${birdType} starting from week ${currentAgeWeeks}.`,
      config: {
        systemInstruction: "You are a poultry health expert. Return a JSON array of objects with keys: vaccineName (string), scheduledAgeWeeks (number), and description (string). Focus on standard vaccines like Mareks, Newcastle, Gumboro, and Fowl Pox.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              vaccineName: { type: Type.STRING },
              scheduledAgeWeeks: { type: Type.NUMBER },
              description: { type: Type.STRING }
            },
            required: ["vaccineName", "scheduledAgeWeeks", "description"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
