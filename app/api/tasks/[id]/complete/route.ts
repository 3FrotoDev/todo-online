import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;
    const user_id  = request.nextUrl.searchParams.get("user_id") as any

    const body = await request.json();
    const { completed } = body;

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Completed status is required and must be a boolean' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        completed,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user_id)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task completion:', error);
      return NextResponse.json(
        { error: 'Failed to update task completion' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/tasks/[id]/complete:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
