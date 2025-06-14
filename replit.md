# MindfulChat - Mental Health Support Application

## Overview

MindfulChat is a comprehensive mental health support application that provides empathetic AI-powered conversations, guided wellness exercises, mood tracking, and crisis support resources. The application is built as a full-stack web application using React for the frontend and Express.js for the backend, with PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for mental health themes
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Authentication**: Mock authentication system (ready for Replit Auth integration)

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4o for empathetic chat responses
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
The application uses a relational database schema with the following key tables:
- **Users**: Store user profiles and authentication data
- **Sessions**: Handle user session management
- **Conversations**: Organize chat conversations by user
- **Messages**: Store individual chat messages with sentiment analysis
- **Exercises**: Catalog of wellness exercises (breathing, journaling, mindfulness, movement)
- **Exercise Completions**: Track user exercise completion
- **Mood Entries**: Store user mood tracking data

## Key Components

### Chat System
- Real-time AI conversations with empathetic responses
- Sentiment analysis and stress indicator detection
- Crisis detection with automatic resource suggestions
- Conversation history persistence
- Message categorization and analytics

### Wellness Features
- Guided breathing exercises with visual cues
- Journaling prompts and mood tracking
- Mindfulness meditation guides
- Physical movement suggestions
- Progress tracking and completion metrics

### User Interface
- Responsive design optimized for both desktop and mobile
- Calming color palette with accessibility considerations
- Intuitive sidebar navigation with exercise categories
- Crisis support modal with emergency resources
- Toast notifications for user feedback

### AI Integration
- OpenAI GPT-4o integration for natural conversations
- Specialized prompts for mental health support
- Automated sentiment analysis of user messages
- Stress indicator detection and response categorization
- Crisis language detection with appropriate escalation

## Data Flow

1. **User Authentication**: Users authenticate through Replit Auth (currently mocked)
2. **Chat Interaction**: Messages flow through Express API to OpenAI for processing
3. **Response Generation**: AI generates empathetic responses with metadata analysis
4. **Data Persistence**: All conversations and user interactions stored in PostgreSQL
5. **Real-time Updates**: Frontend updates using React Query's optimistic updates
6. **Wellness Tracking**: Exercise completions and mood entries stored for progress tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **openai**: AI conversation generation
- **@tanstack/react-query**: Server state management
- **express**: Backend API framework

### UI Dependencies
- **@radix-ui/**: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Development Dependencies
- **typescript**: Type safety across the application
- **vite**: Fast development and build tooling
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR for frontend, tsx for backend
- **Port Configuration**: Frontend on port 5000, proxied through Express
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET

### Production Deployment
- **Build Process**: Vite builds frontend to dist/public, esbuild bundles backend
- **Deployment Target**: Replit autoscale deployment
- **Static Assets**: Served through Express static middleware
- **Database Migrations**: Drizzle Kit for schema management

### Environment Configuration
- **Development**: NODE_ENV=development with hot reloading
- **Production**: NODE_ENV=production with optimized builds
- **Database**: PostgreSQL with session storage and connection pooling
- **AI Service**: OpenAI API integration with error handling

## Changelog

```
Changelog:
- June 14, 2025. Initial setup and Replit migration completed
- June 14, 2025. Enhanced AI system with personalized context analysis implemented
  - Added mood pattern analysis (mood, energy, anxiety tracking)
  - Implemented conversation theme detection
  - Added exercise completion tracking for AI context
  - Enhanced GPT-4o prompts with user history integration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```