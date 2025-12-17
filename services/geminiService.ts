import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AnalysisMode } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCodeAnalysis = async (
  code: string,
  fileName: string,
  mode: AnalysisMode
): Promise<string> => {
  if (!API_KEY) {
    return "Error: API_KEY is missing. Please configure your environment.";
  }

  const thinkingBudget = mode === AnalysisMode.DEEP ? 2048 : 0;
  const modelName = 'gemini-2.5-flash';

  try {
    const prompt = `Analyze the following file: ${fileName}.
    
    Code Content:
    ${code}
    
    Please provide a brief summary of what this file does, and listing 3 potential improvements or observations.
    Format as Markdown.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget },
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze code. Please check console for details.";
  }
};

export const createChatSession = (systemInstruction?: string) => {
  if (!API_KEY) {
    throw new Error("API Key missing");
  }
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction || "You are an expert Remix and React engineer. Help the user with their code.",
      thinkingConfig: { thinkingBudget: 1024 } // Enable some thinking for chat to be smarter
    }
  });
};

export const sendMessageStream = async (
  chat: Chat,
  message: string,
  onChunk: (text: string) => void
) => {
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    onChunk("\n[Error: Connection interrupted or API limit reached]");
  }
};