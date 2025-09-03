# Todo List App

## CS50x Final Project 2025

By Ali Mousa (3froto)
### Web App Demo: [Link](https://todo-online-6om5.vercel.app)
### Video Demo: [Video Link](https://youtu.be/5DZdLwRXqNc)
- **Project Title:** TODO
- **Name:** Ali Osama Mousa
- **Github & EDX username:** 3froto
- **city and country:** Egypt
- **Date:** 9/3/2025

## Project Description

This is my final project for CS50.  
It is a **To-Do App** that helps users manage their daily tasks.  
The app allows users to create, edit, delete, and complete tasks.  
Tasks are organized into three categories: **Today**, **Overdue**, and **Upcoming**.  

The goal of this project is to practice full-stack development skills by combining **Next.js**, **Supabase**, and **TailwindCSS**.

### Key Features

- Task Management: Create, edit, and delete tasks
- Status Tracking: Mark tasks as complete or incomplete
- Priority System: Organize tasks by importance level
- Responsive Design: Works seamlessly on desktop and mobile devices

### Technical Implementation

The application leverages several modern web technologies:

- **Next.js 15**: For server-side rendering and routing
- **React**: For building the user interface components
- **Tailwind CSS**: For responsive and customizable styling
- **HeroUI**: For pre-built UI components
- **CSS Modules**: For component-scoped styling
- **Vercel**: For deployment and hosting

### Project Structure

```
project-root/
├── config/ # General project configurations
├── styles/ # Global styling
│ ├── globals.css # Global styles applied to the app
│ └── index.css # Additional styles or imports
├── types/ # TypeScript definitions and utilities
│ ├── index.ts # Shared types and interfaces
│ ├── utils/
│ │ └── supabase/ # Supabase integration helpers
│ │ ├── actions.ts # CRUD actions with Supabase
│ │ ├── client.ts # Supabase client initialization
│ │ ├── middleware.ts # Supabase middleware (auth/validation)
│ │ └── server.ts # Server-side utilities for Supabase
├── app/ # Next.js App Router (pages + APIs)
│ ├── api/ # API endpoints
│ │ ├── auth/ # Authentication routes
│ │ │ └── callback/
│ │ │ └── route.ts # Handles auth provider callbacks
│ │ └── tasks/ # Task management APIs
│ │ ├── [id]/complete/
│ │ │ └── route.ts # Mark a specific task as complete
│ │ └── route.ts # General tasks API (CRUD)
│ ├── error.tsx # Global error page
│ ├── login/page.tsx # Login page
│ ├── page.tsx # Home/Dashboard page
│ ├── layout.tsx # Root layout (shared UI, providers)
│ └── providers.tsx # Global context providers (theme, auth, etc.)
├── components/ # Reusable UI components
│ ├── sub/
│ │ ├── navbar.tsx # Top navigation bar
│ │ └── sidebar.tsx # Sidebar navigation
│ └── ui/
│ ├── logoutModal.tsx # Logout confirmation modal
│ ├── primitives.ts # Base reusable UI elements
│ ├── ProgressCircle.tsx# Circular progress indicator
│ ├── TaskCard.tsx # Task item card
│ ├── TaskDrawer.tsx # Drawer for task details
│ └── theme-switch.tsx # Light/Dark theme toggle
├── public/ # Static assets
│ ├── favicon.ico # App favicon
│ ├── next.svg # Next.js logo (default)
│ ├── todo_banner.jpg # Banner image for tasks
│ ├── todo_icon.jpg # Icon for the to-do app
│ └── vercel.svg # Vercel logo (default)
├── .env # Environment variables (not committed)
├── .gitignore # Git ignore rules
├── eslint.config.mjs # ESLint configuration
├── LICENSE # Project license
├── middleware.ts # App-level middleware
├── next-env.d.ts # Auto-generated Next.js TypeScript types
├── next.config.js # Next.js configuration
├── package.json # Project dependencies and scripts
├── package-lock.json # Lockfile for dependency versions
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # TailwindCSS configuration
├── tsconfig.json # TypeScript configuration
├── SUPABASE_SETUP.md # Setup guide for Supabase integration
├── supabase-schema.sql # SQL schema for Supabase database
└── README.md # Project documentation
```

### How to Run

1. Clone the repository
2. Install dependencies:
3. Create a `.env.local` file in the project root and copy the content from `.env.example`.  
   Then replace the placeholders with your actual Supabase credentials.
   
```bash
npm install
```

3. Build the app:

```bash
npm run build
```

4. Start the App:

```bash
npm run start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Design Decisions

- Chose Next.js for its built-in performance optimizations and server-side rendering capabilities
- Implemented Tailwind CSS for rapid UI development and consistent styling
- Used HeroUI to maintain a professional look while reducing development time

### Challenges Overcome

1. **Authentication and User Management**
   - This was my first time working with Supabase authentication, and I faced errors with session handling and user tokens.  
   - I solved this by studying Supabase documentation and testing login/logout flows until they worked correctly.  

2. **Task Organization (Today, Overdue, Upcoming)**
   - At first, all tasks were mixed together and it was hard to filter them.  
   - I learned to use date comparisons to decide if a task belongs to today, is overdue, or upcoming.  

3. **Real-Time Updates and UI Refresh**
   - Initially, tasks updated only after refreshing the page.  
   - I solved this by re-fetching tasks from the API after every operation and updating the local state for smoother user experience.  

4. **User Interface and Responsiveness**
   - Styling the app with Tailwind was challenging, especially making it responsive.  
   - Over time, I improved my Tailwind usage and created a clean, modern UI.

### Possible Future Improvements

- User authentication system
- Task categories and tags
- Data persistence with a database

### About the Developer

My name is Ali Mousa, and I'm a CS50x student from Egypt. Prior to taking CS50x, I had alot of experince in programming. This course has been an incredible journey, starting from the basics of C programming and culminating in this web development project.

Throughout CS50x, I've learned fundamental concepts like algorithms, data structures, and software design principles. The transition from C to Python, and then to web development with JavaScript, has given me a comprehensive understanding of different programming paradigms.

This final project combines everything I've learned, particularly from Week 8 (HTML, CSS, JavaScript) and Week 9 (Flask, Python). While the technologies used (Next.js, React) go beyond CS50x's curriculum, the core principles learned in the course - especially regarding problem-solving and writing clean, efficient code - were instrumental in building this application.

I chose to create TODO because I wanted to solve a real-world problem while challenging myself with modern web technologies.



