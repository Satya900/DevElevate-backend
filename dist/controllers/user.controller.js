"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbot = void 0;
const generative_ai_1 = require("@google/generative-ai");
// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chatbot = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required"
            });
        }
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key not configured"
            });
        }
        // Format messages for Gemini API
        const formattedMessages = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));
        // Start a chat session
        const chat = model.startChat({
            history: formattedMessages.slice(0, -1), // All but the last message as history
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
        // Send the latest message
        const latestMessage = formattedMessages[formattedMessages.length - 1].parts[0].text;
        const result = await chat.sendMessage(latestMessage);
        const response = await result.response;
        const assistantMessage = response.text();
        if (!assistantMessage) {
            throw new Error('No response from AI assistant');
        }
        res.json({
            success: true,
            message: assistantMessage
        });
    }
    catch (error) {
        console.error('Chatbot API error:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.chatbot = chatbot;
//# sourceMappingURL=user.controller.js.map