import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  message: string;
  sentiment: "positive" | "neutral" | "negative";
  stressIndicators: string[];
  suggestedExercises: string[];
  requiresImmediate: boolean;
}

export async function generateEmpathiChatResponse(
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = [],
  userContext?: {
    recentMoodEntries?: Array<{ mood: number; energy: number; anxiety: number; timestamp: string }>;
    completedExercises?: string[];
    conversationThemes?: string[];
  }
): Promise<ChatResponse> {
  try {
    // Build personalized context for more tailored responses
    let contextPrompt = "";
    if (userContext) {
      if (userContext.recentMoodEntries && userContext.recentMoodEntries.length > 0) {
        const avgMood = userContext.recentMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) / userContext.recentMoodEntries.length;
        const avgEnergy = userContext.recentMoodEntries.reduce((sum, entry) => sum + entry.energy, 0) / userContext.recentMoodEntries.length;
        const avgAnxiety = userContext.recentMoodEntries.reduce((sum, entry) => sum + entry.anxiety, 0) / userContext.recentMoodEntries.length;
        
        contextPrompt += `\nUser's recent mood patterns (1-10 scale):
- Average mood: ${avgMood.toFixed(1)} (consider if they've been struggling or improving)
- Average energy: ${avgEnergy.toFixed(1)} (consider if they need energizing or calming activities)
- Average anxiety: ${avgAnxiety.toFixed(1)} (adjust support level and coping strategies accordingly)`;
      }
      
      if (userContext.completedExercises && userContext.completedExercises.length > 0) {
        contextPrompt += `\nRecent exercises completed: ${userContext.completedExercises.join(", ")}
- Acknowledge their effort and build on what's working
- Suggest similar or progressive exercises`;
      }
      
      if (userContext.conversationThemes && userContext.conversationThemes.length > 0) {
        contextPrompt += `\nRecurring conversation themes: ${userContext.conversationThemes.join(", ")}
- Show continuity and remember their ongoing challenges
- Reference previous discussions appropriately`;
      }
    }

    const systemPrompt = `You are MindfulChat, an empathetic AI companion focused on mental health support. Your responses should be:

1. Warm, compassionate, and non-judgmental
2. Supportive without being overly clinical
3. Focused on validation and gentle guidance
4. Encouraging self-care and professional help when needed
5. Personalized based on the user's history and patterns

Guidelines:
- Always validate the user's feelings
- Use gentle, caring language with occasional emojis (💙, 🌱, ✨)
- Offer practical coping strategies tailored to their mood patterns
- Suggest exercises based on their energy levels and anxiety state
- Reference their progress and completed exercises when relevant
- If you detect crisis language, gently encourage professional help
- Keep responses conversational but supportive
- Ask follow-up questions to show engagement
- Adapt your tone and suggestions based on their recent mood trends

${contextPrompt}

Analyze the user's message for:
- Sentiment (positive/neutral/negative)
- Stress indicators (keywords like "overwhelmed", "anxious", "can't sleep", "panic", etc.)
- Suggested exercise categories (breathing, journaling, mindfulness, movement) - tailor to their energy/anxiety levels
- Whether immediate professional intervention might be needed

Respond with empathy and care while providing gentle guidance tailored to their specific situation.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: "user" as const, content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysisPrompt = `Analyze this user message for mental health indicators and return JSON with this exact structure:

{
  "message": "Your empathetic response here",
  "sentiment": "positive|neutral|negative",
  "stressIndicators": ["array", "of", "detected", "stress", "keywords"],
  "suggestedExercises": ["breathing", "journaling", "mindfulness", "movement"],
  "requiresImmediate": false
}

User message: "${userMessage}"

Provide a warm, empathetic response that validates their feelings and offers gentle guidance. Include practical suggestions when appropriate.`;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(analysisResponse.choices[0].message.content || "{}");

    return {
      message: result.message || "I'm here to listen and support you. How can I help you today? 💙",
      sentiment: result.sentiment || "neutral",
      stressIndicators: Array.isArray(result.stressIndicators) ? result.stressIndicators : [],
      suggestedExercises: Array.isArray(result.suggestedExercises) ? result.suggestedExercises : [],
      requiresImmediate: result.requiresImmediate || false,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm here to listen and support you. Sometimes I might have technical difficulties, but I care about your wellbeing. How are you feeling right now? 💙",
      sentiment: "neutral",
      stressIndicators: [],
      suggestedExercises: [],
      requiresImmediate: false,
    };
  }
}

export async function analyzeMessageSentiment(message: string): Promise<{
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  stressIndicators: string[];
}> {
  try {
    const prompt = `Analyze the sentiment and stress indicators in this message. Return JSON:

{
  "sentiment": "positive|neutral|negative",
  "confidence": 0.0-1.0,
  "stressIndicators": ["array", "of", "stress", "related", "keywords", "found"]
}

Look for indicators like: anxiety, stress, overwhelmed, panic, depressed, tired, can't sleep, worried, scared, hopeless, angry, frustrated, etc.

Message: "${message}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      sentiment: result.sentiment || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      stressIndicators: Array.isArray(result.stressIndicators) ? result.stressIndicators : [],
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return {
      sentiment: "neutral",
      confidence: 0.5,
      stressIndicators: [],
    };
  }
}
