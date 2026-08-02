import { google } from "@ai-sdk/google";

/**
 * Model configuration for the central AI interaction (qualification chat).
 * This file centralizes the model choice and the system prompt.
 * 
 * Future extensions (like FE-07) can build on this module.
 */

// We use gemini-1.5-flash as the default capable model for this chat
export const chatModel = google('gemini-3.5-flash');

export const chatSystemPrompt = `
You are a helpful and professional qualification assistant. 
Your goal is to guide the user through a brief qualification process.
Keep your responses concise, clear, and action-oriented. 
Ask one question at a time to keep the conversation flowing smoothly.
`;
