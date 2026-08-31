import { google } from "@ai-sdk/google";

/**
 * Model configuration for the central AI interaction (qualification chat).
 * This file centralizes the model choice and the system prompt.
 * 
 * Future extensions (like FE-07) can build on this module.
 */

// Prioritized list of Gemini models to fall back on in case of deprecation or expiration
export const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

export const chatModel = google(GEMINI_MODEL_FALLBACKS[0]);

export const chatSystemPrompt = `
You are a helpful and professional qualification assistant. 
Your goal is to guide the user through a brief qualification process.
Keep your responses concise, clear, and action-oriented. 
Ask one question at a time to keep the conversation flowing smoothly.

Once you have gathered the user's company name, employee count, and industry, you MUST call the \`scoreLead\` tool to qualify the lead. Do not ask them for their score, just call the tool.
`;
