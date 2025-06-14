import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateEmpathiChatResponse, analyzeMessageSentiment } from "./openai";
import { 
  insertConversationSchema, 
  insertMessageSchema, 
  insertExerciseCompletionSchema,
  insertMoodEntrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Conversation routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationData = insertConversationSchema.parse({
        ...req.body,
        userId,
      });
      
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Chat message route
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, conversationId } = req.body;

      if (!message || !conversationId) {
        return res.status(400).json({ message: "Message and conversation ID required" });
      }

      // Analyze user message sentiment
      const analysis = await analyzeMessageSentiment(message);

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content: message,
        role: "user",
        sentiment: analysis.sentiment,
        stressIndicators: analysis.stressIndicators,
      });

      // Get conversation history for context
      const conversationMessages = await storage.getConversationMessages(conversationId);
      const history = conversationMessages.slice(-10).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateEmpathiChatResponse(message, history);

      // Save AI message
      const assistantMessage = await storage.createMessage({
        conversationId,
        content: aiResponse.message,
        role: "assistant",
        sentiment: "positive", // AI responses are generally supportive
        stressIndicators: [],
      });

      res.json({
        userMessage,
        assistantMessage,
        analysis: {
          sentiment: analysis.sentiment,
          stressIndicators: analysis.stressIndicators,
          suggestedExercises: aiResponse.suggestedExercises,
          requiresImmediate: aiResponse.requiresImmediate,
        }
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Exercise routes
  app.get('/api/exercises', async (req, res) => {
    try {
      const { category } = req.query;
      let exercises;
      
      if (category && typeof category === 'string') {
        exercises = await storage.getExercisesByCategory(category);
      } else {
        exercises = await storage.getAllExercises();
      }
      
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post('/api/exercises/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completionData = insertExerciseCompletionSchema.parse({
        ...req.body,
        userId,
      });
      
      const completion = await storage.recordExerciseCompletion(completionData);
      res.json(completion);
    } catch (error) {
      console.error("Error recording exercise completion:", error);
      res.status(500).json({ message: "Failed to record exercise completion" });
    }
  });

  // Mood tracking routes
  app.post('/api/mood', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moodData = insertMoodEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const moodEntry = await storage.createMoodEntry(moodData);
      res.json(moodEntry);
    } catch (error) {
      console.error("Error saving mood entry:", error);
      res.status(500).json({ message: "Failed to save mood entry" });
    }
  });

  app.get('/api/mood', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const moodEntries = await storage.getUserMoodEntries(userId, limit);
      res.json(moodEntries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  // Seed default exercises
  app.post('/api/seed-exercises', async (req, res) => {
    try {
      const defaultExercises = [
        {
          title: "4-7-8 Breathing",
          description: "A calming breathing technique to reduce anxiety",
          category: "breathing" as const,
          duration: 3,
          instructions: "1. Exhale completely through your mouth\n2. Close your mouth and inhale through your nose for 4 counts\n3. Hold your breath for 7 counts\n4. Exhale through your mouth for 8 counts\n5. Repeat 3-4 times",
          icon: "fas fa-wind"
        },
        {
          title: "Gratitude Journal",
          description: "Write down three things you're grateful for",
          category: "journaling" as const,
          duration: 5,
          instructions: "1. Find a quiet space\n2. Think about your day\n3. Write down 3 specific things you're grateful for\n4. Include why each thing matters to you\n5. Notice how you feel after writing",
          icon: "fas fa-pen"
        },
        {
          title: "Body Scan Meditation",
          description: "Mindful awareness of your body from head to toe",
          category: "mindfulness" as const,
          duration: 10,
          instructions: "1. Lie down comfortably\n2. Close your eyes and breathe naturally\n3. Start at the top of your head\n4. Slowly notice each part of your body\n5. Notice any sensations without judgment\n6. Move down to your toes",
          icon: "fas fa-spa"
        },
        {
          title: "Progressive Muscle Relaxation",
          description: "Tense and release muscle groups to reduce physical stress",
          category: "movement" as const,
          duration: 15,
          instructions: "1. Start with your toes - tense for 5 seconds, then relax\n2. Move up to your calves, thighs, etc.\n3. Tense each muscle group for 5 seconds\n4. Notice the contrast between tension and relaxation\n5. End with your face and scalp",
          icon: "fas fa-dumbbell"
        }
      ];

      for (const exercise of defaultExercises) {
        await storage.createExercise(exercise);
      }

      res.json({ message: "Default exercises seeded successfully" });
    } catch (error) {
      console.error("Error seeding exercises:", error);
      res.status(500).json({ message: "Failed to seed exercises" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
