import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Task {
  id: string;
  title: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  category: string;
  priority: string;
  completed: boolean;
  color: string;
  description: string;
  overdueDays?: number;
  created_at?: string;
  updated_at?: string;
}

interface TaskData {
  todayTasks: Task[];
  overdueTasks: Task[];
  upcomingTasks: Task[];
}

function categorizeTask(task: Task): 'today' | 'overdue' | 'upcoming' {
  const now = new Date();
  const startTime = new Date(task.startTime);
  const endTime = new Date(task.endTime);
  
  if (endTime < now) {
    return 'overdue';
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(startTime);
  taskDate.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) {
    return 'today';
  }
  
  return 'upcoming';
}

function calculateOverdueDays(endTime: string): number {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = now.getTime() - end.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function reorganizeTasks(taskList: Task[]): TaskData {
  const todayTasks: Task[] = [];
  const overdueTasks: Task[] = [];
  const upcomingTasks: Task[] = [];

  taskList.forEach(task => {
    const category = categorizeTask(task);
    
    if (category === 'today') {
      todayTasks.push(task);
    } else if (category === 'overdue') {
      overdueTasks.push({
        ...task,
        overdueDays: calculateOverdueDays(task.endTime)
      });
    } else {
      upcomingTasks.push(task);
    }
  });

  return { todayTasks, overdueTasks, upcomingTasks };
}

export async function GET(request: NextRequest) {
  try {
    const user_id = request.nextUrl.searchParams.get("user_id");

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq("user_id", user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    const organizedTasks = reorganizeTasks(data || []);
    return NextResponse.json(organizedTasks);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user_id = request.nextUrl.searchParams.get("user_id");

    const { title, timeSlot, category, priority, description } = body;
    if (!title || !timeSlot || !category || !priority || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const timeParts = timeSlot.split(' - ');
    const startTime = timeParts[0] || timeSlot;
    const endTime = timeParts[1] || timeSlot;

    const colorMap: { [key: string]: string } = {
      work: 'blue',
      health: 'purple',
      learning: 'teal',
      personal: 'pink',
      finance: 'green',
      travel: 'yellow'
    };

    const newTask = {
      title,
      timeSlot,
      startTime,
      endTime,
      category,
      priority,
      description,
      completed: false,
      color: colorMap[category] || 'gray',
      user_id: user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
