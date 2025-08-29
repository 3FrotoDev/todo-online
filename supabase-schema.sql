-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_startTime ON tasks(startTime);
CREATE INDEX IF NOT EXISTS idx_tasks_endTime ON tasks(endTime);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can modify this based on your auth requirements)
CREATE POLICY "Allow all operations" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO tasks (title, timeSlot, startTime, endTime, category, priority, description, color) VALUES
  ('Workout for 30min', '2024-01-15T08:00:00.000Z - 2024-01-15T08:30:00.000Z', '2024-01-15T08:00:00.000Z', '2024-01-15T08:30:00.000Z', 'health', 'high', 'Morning workout routine to stay healthy', 'purple'),
  ('Design the home screen of the music app', '2024-01-15T11:00:00.000Z - 2024-01-15T12:00:00.000Z', '2024-01-15T11:00:00.000Z', '2024-01-15T12:00:00.000Z', 'work', 'medium', 'Create UI design for music app homepage', 'blue'),
  ('Learn react js', '2024-01-15T13:00:00.000Z - 2024-01-15T14:00:00.000Z', '2024-01-15T13:00:00.000Z', '2024-01-15T14:00:00.000Z', 'learning', 'high', 'Study React fundamentals and hooks', 'teal'),
  ('Review project documentation', '2024-01-15T15:00:00.000Z - 2024-01-15T16:00:00.000Z', '2024-01-15T15:00:00.000Z', '2024-01-15T16:00:00.000Z', 'work', 'low', 'Go through project docs and update if needed', 'blue'),
  ('Call mom', '2024-01-15T18:00:00.000Z - 2024-01-15T18:30:00.000Z', '2024-01-15T18:00:00.000Z', '2024-01-15T18:30:00.000Z', 'personal', 'medium', 'Weekly check-in call with family', 'pink'),
  ('Complete project proposal', '2024-01-14T14:00:00.000Z - 2024-01-14T15:00:00.000Z', '2024-01-14T14:00:00.000Z', '2024-01-14T15:00:00.000Z', 'work', 'high', 'Finish the client project proposal document', 'blue'),
  ('Grocery shopping', '2024-01-13T17:00:00.000Z - 2024-01-13T18:00:00.000Z', '2024-01-13T17:00:00.000Z', '2024-01-13T18:00:00.000Z', 'personal', 'medium', 'Buy groceries for the week', 'pink'),
  ('Read chapter 5 of the book', '2024-01-12T19:00:00.000Z - 2024-01-12T20:00:00.000Z', '2024-01-12T19:00:00.000Z', '2024-01-12T20:00:00.000Z', 'learning', 'low', 'Continue reading the programming book', 'teal'),
  ('Team meeting preparation', '2024-01-16T10:00:00.000Z - 2024-01-16T11:00:00.000Z', '2024-01-16T10:00:00.000Z', '2024-01-16T11:00:00.000Z', 'work', 'high', 'Prepare agenda and materials for team meeting', 'blue'),
  ('Dentist appointment', '2024-01-16T15:00:00.000Z - 2024-01-16T16:00:00.000Z', '2024-01-16T15:00:00.000Z', '2024-01-16T16:00:00.000Z', 'health', 'medium', 'Regular dental checkup', 'purple');
