# AI Roadmap Generator

## Overview

An AI-powered learning roadmap generator that creates personalized study plans with milestones, curated resources, and project ideas. Users can input their learning goals, skill level, and preferences, and the application generates a structured roadmap using Google's Gemini Flash Lite API. The platform tracks progress, maintains learning streaks, and provides an interactive dashboard for managing multiple learning paths.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for component-based UI
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management and caching
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with CSS variables for theming

**Design Patterns:**
- Component-driven architecture with reusable UI components
- Custom hooks for shared logic (e.g., `useToast`, `useIsMobile`)
- Form handling with React Hook Form and Zod validation
- Path aliases configured for clean imports (`@/`, `@shared/`)

**Key Pages:**
- Home: Dashboard with roadmap overview and progress statistics
- Create Roadmap: Multi-step form for generating new learning paths
- Roadmap Detail: Interactive roadmap view with milestone tracking
- Dashboard: Comprehensive progress tracking and achievements

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Node.js runtime (ESM modules)
- In-memory storage implementation with interface for future database migration
- Google Generative AI (Gemini Flash Lite) for roadmap generation

**Design Patterns:**
- Storage interface (`IStorage`) for data access abstraction
- Currently using `MemStorage` (in-memory) implementation
- Prepared for PostgreSQL migration via Drizzle ORM
- RESTful API endpoints under `/api` prefix
- Middleware for request logging and JSON parsing

**API Structure:**
- `POST /api/roadmaps/generate`: Generate AI-powered roadmaps
- Roadmap CRUD operations (get, create, update, delete)
- Milestone management and progress tracking
- User progress statistics endpoints

### Data Storage

**Current Implementation:**
- In-memory storage using JavaScript Maps
- Storage interface supports easy migration to persistent database

**Prepared Schema (Drizzle ORM):**
- `users`: User authentication and profiles
- `roadmaps`: Learning roadmap metadata and phases
- `milestones`: Individual learning milestones with resources
- `userProgress`: Progress tracking and streak information

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts` with Zod validation
- Migration support via drizzle-kit

**Design Decision:**
The application uses an interface-based storage pattern that allows switching from in-memory to PostgreSQL without changing business logic. The `IStorage` interface defines all data operations, making the storage layer pluggable.

### External Dependencies

**Google Gemini API Integration:**
- Purpose: Generate personalized learning roadmaps based on user input
- Model: gemini-flash-lite-latest
- API Key: Required via `GEMINI_API_KEY` environment variable
- Implementation: Server-side only for API key security
- Prompt engineering: Structured JSON output with phases, milestones, and resources

**Database Service:**
- Neon Serverless PostgreSQL configured via `@neondatabase/serverless`
- Connection: `DATABASE_URL` environment variable
- Not currently active (using in-memory storage)
- Ready for activation when database is provisioned

**UI Component Libraries:**
- Radix UI: Accessible, unstyled component primitives
- shadcn/ui: Pre-built component collection with Tailwind styling
- Components include forms, dialogs, cards, progress bars, tabs, etc.

**Development Tools:**
- Replit-specific plugins for error handling and development banners
- Vite plugins for runtime error overlay and source mapping

**PDF Generation:**
- jsPDF library for exporting roadmaps to PDF format
- Client-side implementation for roadmap downloads

**Validation:**
- Zod for schema validation across frontend and backend
- drizzle-zod for database schema integration

**Session Management:**
- connect-pg-simple for PostgreSQL session storage (prepared)
- Session middleware configuration ready for authentication