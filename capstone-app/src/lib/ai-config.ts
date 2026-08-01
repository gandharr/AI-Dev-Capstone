import { anthropic } from "@ai-sdk/anthropic";

/**
 * Model configuration for the central AI interaction (qualification chat).
 * This file centralizes the model choice and the system prompt.
 * 
 * Future extensions (like FE-07) can build on this module.
 */

// We use claude-3-5-sonnet-20240620 as the default capable model for this chat
export const chatModel = anthropic('claude-3-5-sonnet-20240620');

export const chatSystemPrompt = `
You are a helpful and professional qualification assistant. 
Your goal is to guide the user through a brief qualification process.
Keep your responses concise, clear, and action-oriented. 
Ask one question at a time to keep the conversation flowing smoothly.
`;
