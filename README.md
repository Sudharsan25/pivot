# PIVOT: Progress that doesn't break

A habit and urge tracking application designed specifically for users with ADHD.
The app helps users log, track, and manage their urges in real-time with minimal
friction, providing immediate feedback and lifetime statistics to support
behavior change.

## Features

- **Quick Log Buttons**: One-tap logging of urges with immediate outcome
  selection (Resisted, Gave In, Delayed)
- **Panic Button**: Timer-based intervention tool that automatically sets
  outcome to "Delayed" if timer runs for more than 10 seconds
- **Manual Urge Form**: Detailed logging with trigger and notes fields
- **Habit Management**:
  - Standard habits (shared across all users)
  - Custom habits (user-specific)
  - Visual labels to distinguish habit types
- **Statistics Dashboard**:
  - Lifetime stats that never reset
  - Breakdown by habit type
  - Time-series charts for progress tracking
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern, accessible UI with smooth animations

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Navigation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **React Hook Form** + **Zod** - Form validation
- **Axios** - HTTP client

### Backend

- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** + **Passport** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

## Project Structure

```
the_next_fight/
├── frontend/          # React frontend application
├── backend/           # NestJS backend API
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Configure environment variables
npm run db:migrate
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## License

UNLICENSED
