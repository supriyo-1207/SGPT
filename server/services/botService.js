const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts"); // Import MessagesPlaceholder
const { BufferMemory } = require("langchain/memory");
async function generateBotResponse(message, model) {
    let response1;
    try {
        const model = new ChatGoogleGenerativeAI({
            modelName: "gemini-1.5-flash",
            apiKey: process.env.GEMINI_API_KEY,
            temperature: 0.7,
        });

        const memory = new BufferMemory({
            returnMessages: true,
            memoryKey: "history",
        });

        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful AI assistant who remembers previous conversation context."],
            new MessagesPlaceholder("history"), // Add this line to include history
            ["user", "{input}"],
        ]);

        const conversation = new ConversationChain({
            llm: model,
            memory: memory,
            prompt: promptTemplate,
        });

         response1 = await conversation.call({ input: message });
        console.log("AI Response 1:", response1.response);

        // const response2 = await conversation.call({ input: "What are some of his biggest achievements?" });
        // console.log("AI Response 2:", response2.response);

    } catch (error) {
        console.error("Error generating text:", error);
    }
    return `Echo: ${response1.response} using model: ${model}`;
}



module.exports = {
    generateBotResponse
};