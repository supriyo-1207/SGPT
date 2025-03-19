const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { BufferMemory } = require("langchain/memory");

async function generateBotResponse(message) {
    let response1;
    try {
        // Initialize the Gemini model
        const model = new ChatGoogleGenerativeAI({
            modelName: "gemini-1.5-flash", // Ensure this is the correct model name
            apiKey: process.env.GEMINI_API_KEY, // Make sure this environment variable is set
            temperature: 0.7,
        });

        // Initialize memory to store conversation history
        const memory = new BufferMemory({
            returnMessages: true, // Return messages as an array
            memoryKey: "history", // Key to store the conversation history
        });

        // Define the prompt template with a placeholder for history
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful AI assistant who remembers previous conversation context."],
            new MessagesPlaceholder("history"), // Inject conversation history here
            ["user", "{input}"], // User's input
        ]);

        // Create a conversation chain with the model, memory, and prompt
        const conversation = new ConversationChain({
            llm: model,
            memory: memory,
            prompt: promptTemplate,
        });

        // Generate a response using the conversation chain
        response1 = await conversation.call({ input: message });
        console.log("AI Response:", response1.response);

    } catch (error) {
        console.error("Error generating text:", error);
    }

    // Return the AI's response
    return response1.response;
}

module.exports = {
    generateBotResponse
};