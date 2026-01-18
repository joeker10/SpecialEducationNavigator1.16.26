
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_TEMPLATE } from "../constants";
import { GroundingSource } from "../types";

let chatSession: Chat | null = null;

export const initializeChatSession = (stateName: string) => {
  // Use the API key exclusively from the environment variable as per guidelines.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing in environment variables.");
  }

  // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use gemini-3-pro-preview for complex legal reasoning and state regulation tasks.
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE(stateName),
      tools: [{ googleSearch: {} }],
      temperature: 0.2, // Lower temperature for higher factual precision in legal context
    },
  });
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void,
  onComplete: (fullText: string, sources: GroundingSource[]) => void,
  onError: (error: any) => void
) => {
  if (!chatSession) {
    onError("Chat session not initialized.");
    return;
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message });
    
    let fullText = "";
    let sources: GroundingSource[] = [];

    for await (const chunk of resultStream) {
      const contentChunk = chunk as GenerateContentResponse;
      // Directly access the .text property as per SDK documentation.
      const textPart = contentChunk.text;
      
      if (textPart) {
        fullText += textPart;
        onChunk(fullText);
      }

      // Extract grounding metadata if available and push to source list for later display.
      const groundingMetadata = contentChunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((c: any) => {
          if (c.web?.uri && c.web?.title) {
            sources.push({
              title: c.web.title,
              uri: c.web.uri
            });
          }
        });
      }
    }

    // Deduplicate sources based on URI to provide a clean reference list for the user.
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    onComplete(fullText, uniqueSources);
  } catch (error) {
    console.error("Error in stream:", error);
    onError(error);
  }
};
