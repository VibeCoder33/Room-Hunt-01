# Find a Mate - Roommate Matching Platform

## Overview

Find a Mate is a comprehensive roommate matching platform designed to connect compatible roommates based on lifestyle preferences, habits, and personality traits. Unlike traditional property rental platforms, this application focuses on deep compatibility matching to ensure harmonious living arrangements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with standardized error handling
- **Real-time Communication**: WebSocket integration for messaging
- **Authentication**: Replit Auth integration with OpenID Connect

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless adapter
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

## Key Components

### User Management System
- **Dual Profile System**: Room seekers and room owners with distinct workflows
- **Profile Management**: Comprehensive lifestyle preference tracking including sleep schedules, dietary preferences, smoking/drinking habits, work schedules, and cleanliness levels
- **Authentication Flow**: Secure OAuth-based authentication with session management

### Compatibility Matching Engine
- **Algorithm**: Multi-factor compatibility scoring based on lifestyle alignment
- **Weighted Scoring**: Different lifestyle factors have varying importance (smoking: 20%, sleep schedule: 15%, etc.)
- **Smart Recommendations**: Personalized match suggestions with compatibility breakdowns

### Messaging System
- **Real-time Chat**: WebSocket-powered messaging between matched users
- **Safety Features**: In-app communication with read receipts and conversation management
- **Communication Tools**: Video call scheduling and safety guidelines

### Room Listing Management
- **Rich Listings**: Property details combined with lifestyle requirements and house rules
- **Advanced Filtering**: Location, budget, and lifestyle-based search capabilities
- **Owner Tools**: Listing creation, management, and applicant screening

### Administrative Dashboard
- **Analytics**: User engagement, successful matches, and platform metrics
- **User Management**: User oversight and content moderation tools
- **System Monitoring**: Platform health and usage statistics

## Data Flow

### User Registration & Profile Creation
1. User authenticates via Replit Auth
2. System creates user record and redirects to profile setup
3. User completes lifestyle preference questionnaire
4. Profile stored with compatibility scoring preparation

### Matching Process
1. User browses available listings or roommate profiles
2. System calculates real-time compatibility scores
3. Advanced filters applied based on user preferences
4. Results displayed with compatibility breakdowns

### Communication Flow
1. Users express interest through the platform
2. System facilitates secure in-app messaging
3. WebSocket connections enable real-time communication
4. Video call scheduling and safety features provided

### Listing Management
1. Room owners create detailed property listings
2. Lifestyle requirements and house rules specified
3. System matches with compatible room seekers
4. Application and screening process managed through platform

## External Dependencies

### Authentication & Session Management
- **Replit Auth**: OAuth provider integration for secure authentication
- **OpenID Connect**: Industry-standard authentication protocol
- **PostgreSQL Sessions**: Persistent session storage with automatic cleanup

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations with automatic migrations
- **Connection Pooling**: Efficient database connection management

### UI & Design System
- **Radix UI**: Accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library with consistent design
- **Tailwind CSS**: Utility-first styling with design system integration
- **Lucide Icons**: Consistent iconography throughout the application

### Development & Build Tools
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for server-side code
- **PostCSS**: CSS processing with Tailwind integration

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon development database with migrations
- **Authentication**: Replit Auth development configuration
- **Real-time Features**: WebSocket connections for live development

### Production Deployment
- **Build Process**: Vite builds client assets, ESBuild bundles server code
- **Static Assets**: Client build output served from Express server
- **Database Migrations**: Automated schema deployment via Drizzle Kit
- **Session Management**: Production-ready session storage with PostgreSQL
- **Environment Configuration**: Secure environment variable management for database URLs and auth secrets

### Scalability Considerations
- **Database Connection Pooling**: Efficient resource utilization with Neon serverless
- **Static Asset Optimization**: Vite's optimized bundling and code splitting
- **Session Store**: PostgreSQL-backed sessions for horizontal scaling
- **WebSocket Management**: Scalable real-time communication architecture

The application follows modern full-stack development practices with type safety, secure authentication, and real-time communication capabilities, designed specifically for the unique requirements of roommate matching and compatibility assessment.