import {
  users,
  conversations,
  messages,
  exercises,
  exerciseCompletions,
  moodEntries,
  type User,
  type UpsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Exercise,
  type InsertExercise,
  type ExerciseCompletion,
  type InsertExerciseCompletion,
  type MoodEntry,
  type InsertMoodEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getUserConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  
  // Exercise operations
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  recordExerciseCompletion(completion: InsertExerciseCompletion): Promise<ExerciseCompletion>;
  
  // Mood operations
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  
  // Enhanced AI context methods
  getUserRecentExerciseCompletions(userId: string, limit?: number): Promise<Array<ExerciseCompletion & { exerciseTitle?: string }>>;
  getUserConversationThemes(userId: string): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Conversation operations
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  // Exercise operations
  async getAllExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.category, category));
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  async recordExerciseCompletion(completion: InsertExerciseCompletion): Promise<ExerciseCompletion> {
    const [newCompletion] = await db
      .insert(exerciseCompletions)
      .values(completion)
      .returning();
    return newCompletion;
  }

  // Mood operations
  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [newEntry] = await db
      .insert(moodEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getUserMoodEntries(userId: string, limit = 10): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.timestamp))
      .limit(limit);
  }

  // Enhanced AI context methods
  async getUserRecentExerciseCompletions(userId: string, limit = 10): Promise<Array<ExerciseCompletion & { exerciseTitle?: string }>> {
    const results = await db
      .select({
        id: exerciseCompletions.id,
        userId: exerciseCompletions.userId,
        exerciseId: exerciseCompletions.exerciseId,
        completedAt: exerciseCompletions.completedAt,
        rating: exerciseCompletions.rating,
        exerciseTitle: exercises.title,
      })
      .from(exerciseCompletions)
      .leftJoin(exercises, eq(exerciseCompletions.exerciseId, exercises.id))
      .where(eq(exerciseCompletions.userId, userId))
      .orderBy(desc(exerciseCompletions.completedAt))
      .limit(limit);

    return results as Array<ExerciseCompletion & { exerciseTitle?: string }>;
  }

  async getUserConversationThemes(userId: string): Promise<string[]> {
    const recentMessages = await db
      .select({
        content: messages.content,
        stressIndicators: messages.stressIndicators,
      })
      .from(messages)
      .leftJoin(conversations, eq(messages.conversationId, conversations.id))
      .where(and(
        eq(conversations.userId, userId),
        eq(messages.role, "user")
      ))
      .orderBy(desc(messages.timestamp))
      .limit(20);

    // Extract themes from stress indicators and message content
    const themes = new Set<string>();
    
    recentMessages.forEach(msg => {
      if (msg.stressIndicators && Array.isArray(msg.stressIndicators)) {
        msg.stressIndicators.forEach(indicator => themes.add(indicator));
      }
      
      // Simple keyword extraction for common mental health themes
      const content = msg.content?.toLowerCase() || '';
      const keywords = ['anxiety', 'stress', 'work', 'family', 'sleep', 'depression', 'overwhelmed', 'tired', 'worried'];
      keywords.forEach(keyword => {
        if (content.includes(keyword)) themes.add(keyword);
      });
    });

    return Array.from(themes).slice(0, 5); // Return top 5 themes
  }
}

export const storage = new DatabaseStorage();
