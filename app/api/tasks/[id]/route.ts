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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;
    const user_id  = request.nextUrl.searchParams.get("user_id") as any

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq("user_id", user_id)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;
    const body = await request.json();
    const user_id  = request.nextUrl.searchParams.get("user_id") as any

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

    const updateData = {
      title,
      timeSlot,
      startTime,
      endTime,
      category,
      priority,
      description,
      user_id: user_id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;
    const user_id  = request.nextUrl.searchParams.get("user_id") as any
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq("user_id", user_id)
      .eq('id', id);
    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
