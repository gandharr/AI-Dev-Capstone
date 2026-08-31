import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyAvkNwus1yGxYDolhvnw9m5KHfPr8GT26c"
});

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  const start = Date.now();
  try {
    const model = google(modelName);
    const { text } = await generateText({
      model,
      prompt: "Say hello!",
    });
    const duration = (Date.now() - start) / 1000;
    console.log(`Success for ${modelName} in ${duration}s! Response: ${text.trim()}`);
    return duration;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    console.error(`Error for ${modelName} after ${duration}s:`, error.message || error);
    return null;
  }
}

async function main() {
  const models = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-3.6-flash"
  ];

  for (const model of models) {
    await testModel(model);
    console.log("-------------------");
  }
}

main();
