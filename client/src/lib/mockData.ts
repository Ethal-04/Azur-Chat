// Mock data for UI demo
export const mockUser = {
  id: "demo-user",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockExercises = [
  {
    id: 1,
    title: "4-7-8 Breathing",
    description: "A calming breathing technique to reduce anxiety",
    category: "breathing" as const,
    duration: 3,
    instructions: "1. Exhale completely through your mouth\n2. Close your mouth and inhale through your nose for 4 counts\n3. Hold your breath for 7 counts\n4. Exhale through your mouth for 8 counts\n5. Repeat 3-4 times",
    icon: "fas fa-wind",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Gratitude Journal",
    description: "Write down three things you're grateful for",
    category: "journaling" as const,
    duration: 5,
    instructions: "1. Find a quiet space\n2. Think about your day\n3. Write down 3 specific things you're grateful for\n4. Include why each thing matters to you\n5. Notice how you feel after writing",
    icon: "fas fa-pen",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Body Scan Meditation",
    description: "Mindful awareness of your body from head to toe",
    category: "mindfulness" as const,
    duration: 10,
    instructions: "1. Lie down comfortably\n2. Close your eyes and breathe naturally\n3. Start at the top of your head\n4. Slowly notice each part of your body\n5. Notice any sensations without judgment\n6. Move down to your toes",
    icon: "fas fa-spa",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Progressive Muscle Relaxation",
    description: "Tense and release muscle groups to reduce physical stress",
    category: "movement" as const,
    duration: 15,
    instructions: "1. Start with your toes - tense for 5 seconds, then relax\n2. Move up to your calves, thighs, etc.\n3. Tense each muscle group for 5 seconds\n4. Notice the contrast between tension and relaxation\n5. End with your face and scalp",
    icon: "fas fa-dumbbell",
    createdAt: new Date().toISOString(),
  }
];

export const mockConversations = [
  {
    id: 1,
    userId: "demo-user",
    title: "New Conversation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    content: "Hello there! 👋 I'm here to listen and support you. How are you feeling today? Feel free to share what's on your mind - there's no judgment here. 💙",
    role: "assistant" as const,
    sentiment: null,
    stressIndicators: null,
    timestamp: new Date(Date.now() - 60000).toISOString(),
  }
];

// AI response templates
export const aiResponseTemplates = [
  {
    triggers: ["anxious", "anxiety", "worried", "stress"],
    responses: [
      "I hear that you're feeling anxious, and that's completely valid. Anxiety can feel overwhelming, but you're not alone in this. 💙\n\nWould you like to try a quick breathing exercise? Sometimes focusing on our breath can help ground us in the present moment. What's been on your mind that's causing these anxious feelings?",
      "Thank you for sharing that you're feeling anxious. It takes courage to acknowledge these feelings. 🌱\n\nAnxiety often tries to convince us that we're in danger when we're actually safe. Have you noticed any specific thoughts or situations that tend to trigger your anxiety? Understanding our patterns can be really helpful."
    ],
    stressIndicators: ["anxiety", "worried", "stress"],
    suggestedExercises: ["breathing", "mindfulness"]
  },
  {
    triggers: ["sad", "down", "depressed", "low"],
    responses: [
      "I'm sorry you're feeling down right now. Those heavy feelings are real and valid, and I want you to know that it's okay to not be okay sometimes. 💙\n\nEven in difficult moments, you've shown strength by reaching out and sharing. What's one small thing that brought you even a tiny bit of comfort today?",
      "Thank you for trusting me with how you're feeling. When we're down, it can feel like the world loses its color, but please know that these feelings, while painful, are temporary. 🌱\n\nWould it help to talk about what's been weighing on your heart lately?"
    ],
    stressIndicators: ["sadness", "low mood"],
    suggestedExercises: ["journaling", "mindfulness"]
  },
  {
    triggers: ["overwhelmed", "too much", "can't handle", "burnout"],
    responses: [
      "It sounds like you're carrying a really heavy load right now, and feeling overwhelmed is such a natural response to that. You're doing more than you realize. 💙\n\nWhen everything feels like too much, sometimes we need to pause and breathe. What's the one thing that feels most urgent to you right now? We can break things down together.",
      "Feeling overwhelmed is your mind's way of saying 'this is a lot to handle.' You're not failing - you're human, and humans have limits. 🌱\n\nLet's take a step back together. What would it feel like to give yourself permission to tackle just one small thing at a time?"
    ],
    stressIndicators: ["overwhelmed", "burnout"],
    suggestedExercises: ["breathing", "movement"]
  },
  {
    triggers: ["sleep", "tired", "exhausted", "insomnia"],
    responses: [
      "Sleep struggles can be so draining, both physically and emotionally. When our rest is disrupted, everything else feels harder too. 💙\n\nHave you noticed any patterns with your sleep? Sometimes our minds are too active at bedtime, or stress from the day follows us to bed. What does your evening routine look like?",
      "I hear you're having trouble with sleep. That's incredibly frustrating and can make everything feel more difficult. 🌱\n\nGood sleep is so foundational to our wellbeing. Would you like to explore some gentle relaxation techniques that might help your mind and body prepare for rest?"
    ],
    stressIndicators: ["sleep issues", "fatigue"],
    suggestedExercises: ["mindfulness", "breathing"]
  }
];

export const defaultResponse = {
  message: "Thank you for sharing with me. I'm here to listen and support you through whatever you're experiencing. 💙\n\nEvery feeling you have is valid, and you don't have to face anything alone. What would be most helpful for you right now - would you like to talk more about what's on your mind, or explore some coping strategies together?",
  stressIndicators: [],
  suggestedExercises: ["breathing", "journaling"]
};

export function generateMockAIResponse(userMessage: string) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for crisis indicators
  const crisisWords = ["suicide", "kill myself", "end it all", "want to die", "hurt myself"];
  const requiresImmediate = crisisWords.some(word => lowerMessage.includes(word));
  
  // Find matching template
  const matchingTemplate = aiResponseTemplates.find(template =>
    template.triggers.some(trigger => lowerMessage.includes(trigger))
  );
  
  if (matchingTemplate) {
    const randomResponse = matchingTemplate.responses[Math.floor(Math.random() * matchingTemplate.responses.length)];
    return {
      message: randomResponse,
      sentiment: "negative" as const,
      stressIndicators: matchingTemplate.stressIndicators,
      suggestedExercises: matchingTemplate.suggestedExercises,
      requiresImmediate
    };
  }
  
  // Positive responses
  if (lowerMessage.includes("good") || lowerMessage.includes("great") || lowerMessage.includes("happy")) {
    return {
      message: "I'm so glad to hear you're feeling good! It's wonderful when we can recognize and appreciate the positive moments in our lives. 🌟\n\nWhat's contributing to these good feelings? Sometimes reflecting on the positive can help us understand what brings us joy and peace.",
      sentiment: "positive" as const,
      stressIndicators: [],
      suggestedExercises: ["journaling"],
      requiresImmediate: false
    };
  }
  
  // Default response
  return {
    ...defaultResponse,
    sentiment: "neutral" as const,
    requiresImmediate
  };
}