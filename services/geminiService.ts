import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithGemini = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are a helpful AI assistant for a Student Information System called Smart SIS. You help staff, students, and parents with queries about school policies, grades (generic info), and system navigation. Keep answers concise and professional."
      }
    });
    return response.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, the AI service is currently unavailable.";
  }
};

export const translateText = async (text: string, targetLang: 'en' | 'zh'): Promise<string> => {
  try {
    const prompt = `Translate the following educational text to ${targetLang === 'zh' ? 'Chinese' : 'English'}. maintain a professional, academic tone suitable for a student report card. Text: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return text; // Fallback to original
  }
};