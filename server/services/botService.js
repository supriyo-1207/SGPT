const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { BufferMemory } = require("langchain/memory");
require("dotenv").config();

// Persistent memory storage
const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
});

// Initialize Gemini Model (Avoid re-initializing)
const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
});

// Define the prompt template
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful AI assistant who remembers previous conversation context."],
    new MessagesPlaceholder("history"),
    ["user", "{input}"],
]);

// Create the conversation chain once
const conversation = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: promptTemplate,
});

// Function to generate bot response
async function generateBotResponse(message) {
    try {
        
        const response = await conversation.call({ input: message });
        return response.response || response.text; // Ensure proper extraction
    } catch (error) {
        console.error("Error generating text:", error);
        return "Sorry, I couldn't process that.";
    }
}

module.exports = {
    generateBotResponse
};
