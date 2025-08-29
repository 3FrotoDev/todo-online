# Supabase Setup Guide

This guide will help you set up Supabase for the task management application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `task-manager` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
6. Click "Create new project"

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Service Role Key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the SQL

This will create:
- `tasks` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- Automatic `updated_at` timestamp updates
- Sample data

## 5. Install Supabase Client

If not already installed, run:

```bash
npm install @supabase/supabase-js
```

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Open your application
3. Try creating, editing, and deleting tasks
4. Check the Supabase dashboard → **Table Editor** → **tasks** to see your data

## API Endpoints

The application now uses these Supabase-powered API endpoints:

- `GET /api/tasks` - Get all tasks organized by time categories
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task
- `PATCH /api/tasks/[id]/complete` - Update task completion status

## Database Schema

The `tasks` table has the following structure:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  timeSlot TEXT NOT NULL,
  startTime TIMESTAMP WITH TIME ZONE NOT NULL,
  endTime TIMESTAMP WITH TIME ZONE NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  color VARCHAR(20) DEFAULT 'gray',
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Features

✅ **Full CRUD Operations**: Create, Read, Update, Delete tasks
✅ **Real-time Updates**: Tasks are immediately saved to Supabase
✅ **Automatic Categorization**: Tasks are automatically categorized as Today, Overdue, or Upcoming
✅ **Completion Tracking**: Mark tasks as complete/incomplete
✅ **Data Persistence**: All data is stored in Supabase database
✅ **Error Handling**: Proper error handling and user feedback
✅ **Optimistic Updates**: UI updates immediately for better UX

## Troubleshooting

### Common Issues:

1. **"Failed to fetch tasks" error**
   - Check your environment variables
   - Verify your Supabase project is active
   - Check the browser console for detailed errors

2. **"Missing required fields" error**
   - Ensure all required fields are filled in the form
   - Check the API request payload

3. **Tasks not showing up**
   - Verify the database schema was created correctly
   - Check if sample data was inserted
   - Look at the Supabase logs for any errors

### Getting Help:

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review the API logs in your Supabase dashboard
- Check the browser console for client-side errors
