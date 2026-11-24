import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv, { config } from "dotenv"; // to read the .env file

dotenv.config();
const gemini = new GoogleGenAI({}); // initializes the Gemini client and automatically loads the API key from the .env file

const askGemini = async (userPrompt) => {
  // TODO: implement
  try {
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: userPrompt,
      config: {
        thinkingConfig: {
          // thinkingBudget: 0,
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Error generating response with LLM", error);
    throw error;
  }
};

const run = async () => {
  // This is a prompt that would be very hard for a traditional code to answer correctly, hence the power of LLMs
  const userPrompt = `
  Is the following a positive or negative review?
  "Yeah, this was the *best* book ever, only made me want to pull my eyes out of their sockets"`;

  const response = await askGemini(userPrompt);
  console.log(response);

  const { text: responseText, usageMetadata } = response;

  console.log("\n---\n");
  console.log(`Input tokens: ${usageMetadata.promptTokenCount}`);
  console.log(`Output tokens: ${usageMetadata.candidatesTokenCount}`);
  console.log(`Thinking tokens: ${usageMetadata.thoughtsTokenCount ?? 0}`);
  console.log(`Total tokens: ${usageMetadata.totalTokenCount}`);
  console.log("\n---\n");

  console.log(responseText);
};

run();
