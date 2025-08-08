import { Request, Response } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const chatbot = async (req: Request, res: Response) => {
    try {
        const { messages }: { messages: ChatMessage[] } = req.body;

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

        // Ensure the conversation starts with a user message
        const validMessages:any = formattedMessages.filter((msg, index) => {
            // First message must be from user
            if (index === 0) return msg.role === 'user';
            return true;
        });

        // If no valid messages or first message isn't from user
        if (validMessages.length === 0 || validMessages[0].role !== 'user') {
            return res.status(400).json({
                success: false,
                message: "Conversation must start with a user message"
            });
        }

        let assistantMessage: string;

        if (validMessages.length === 1) {
            // If only one message (the current user message), start a new chat
            const result = await model.generateContent(validMessages[0].parts[0].text);
            const response = await result.response;
            assistantMessage = response.text();
        } else {
            // If multiple messages, use chat history
            const history = validMessages.slice(0, -1); // All but the last message
            const latestMessage = validMessages[validMessages.length - 1].parts[0].text;

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(latestMessage);
            const response = await result.response;
            assistantMessage = response.text();
        }

        if (!assistantMessage) {
            throw new Error('No response from AI assistant');
        }

        res.json({
            success: true,
            message: assistantMessage
        });

    } catch (error) {
        console.error('Chatbot API error:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

