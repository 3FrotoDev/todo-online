"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { Icon } from '@iconify/react';
import TaskCard from "@/components/ui/TaskCard";
import ProgressCircle from "@/components/ui/ProgressCircle";
import dynamic from "next/dynamic";
const TaskDrawer = dynamic(() => import('@/components/ui/TaskDrawer'), {
  ssr: false,
});
import { useSidebar } from "@/components/sub/sidebar";
import "@/styles/index.css";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

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
}

interface TaskData {
  todayTasks: Task[];
  overdueTasks: Task[];
  upcomingTasks: Task[];
}

export default function Home() {
  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const [tasks, setTasks] = useState<TaskData>({ todayTasks: [], overdueTasks: [], upcomingTasks: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient()
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User authentication error:', userError);
          setError('Authentication error. Please try logging in again.');
          return;
        }
        
        if (!user) {
          console.error('No user found');
          setError('No user found. Please log in.');
          return;
        }
        
        console.log('User ID:', user.id);
        const response = await fetch(`/api/tasks?user_id=${user.id}`);
        const data = await response.json();        
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
        setError('Failed to load tasks. Please try again.');
        const fallbackData: TaskData = {
          todayTasks: [
            {
              id: "1",
              title: "Workout for 30min",
              timeSlot: new Date().toISOString() + " - " + new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              category: "health",
              priority: "high",
              completed: false,
              color: "purple",
              description: "Morning workout routine to stay healthy"
            },
            {
              id: "2",
              title: "Design the home screen of the music app",
              timeSlot: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() + " - " + new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
              startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
              category: "work",
              priority: "medium",
              completed: false,
              color: "red",
              description: "Create UI design for music app homepage"
            }
          ],
          overdueTasks: [
            {
              id: "3",
              title: "Learn react js",
              timeSlot: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() + " - " + new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
              startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
              category: "learning",
              priority: "high",
              completed: false,
              color: "teal",
              description: "Study React fundamentals and hooks",
              overdueDays: 1
            }
          ],
          upcomingTasks: [
            {
              id: "4",
              title: "Team meeting preparation",
              timeSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() + " - " + new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
              startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
              category: "work",
              priority: "high",
              completed: false,
              color: "blue",
              description: "Prepare agenda and materials for team meeting"
            }
          ]
        };
        
        setTasks(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
    
    const interval = setInterval(() => {
      loadTasks();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleComplete = async (taskId: string) => {
    setTasks(prev => ({
      ...prev,
      todayTasks: prev.todayTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      overdueTasks: prev.overdueTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      upcomingTasks: prev.upcomingTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));

    try {

      const allTasks = [...tasks.todayTasks, ...tasks.overdueTasks, ...tasks.upcomingTasks];
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch(`/api/tasks/${taskId}/complete?user_id=${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task completion');
      }
    } catch (error) {
      const { data: { user } } = await supabase.auth.getUser();
      console.error('Error updating task completion:', error);
      const response = await fetch(`/api/tasks?user_id=${user?.id}`);
      const data = await response.json();
      setTasks(data);
    }
  };

  const handleRenewTask = (task: Task) => {
    setTasks(prev => ({
      ...prev,
      overdueTasks: prev.overdueTasks.filter(t => t.id !== task.id),
      todayTasks: [...prev.todayTasks, { ...task, completed: false, overdueDays: undefined }]
    }));
  };

  const handleDeleteTask = async (taskId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const response = await fetch(`/api/tasks/${taskId}?user_id=${user?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => ({
        todayTasks: prev.todayTasks.filter(t => t.id !== taskId),
        overdueTasks: prev.overdueTasks.filter(t => t.id !== taskId),
        upcomingTasks: prev.upcomingTasks.filter(t => t.id !== taskId),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      const response = await fetch(`/api/tasks?user_id=${user?.id}`);
      const data = await response.json();
      setTasks(data);
    }
  };

  const handleCreateTask = () => {
    setDrawerMode('create');
    setEditingTask(null);
    setTaskDrawerOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setDrawerMode('edit');
    setEditingTask(task);
    setTaskDrawerOpen(true);
  };

    const handleSaveTask = async (taskData: any) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User authentication error in save:', userError);
        return;
      }
      
      if (!user) {
        console.error('No user found in save');
        return;
      }

      if (drawerMode === 'create') {
        console.log('Creating task with user ID:', user.id);
        const response = await fetch(`/api/tasks?user_id=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }


        const tasksResponse = await fetch(`/api/tasks?user_id=${user.id}`);
        const updatedTasks = await tasksResponse.json();
        setTasks(updatedTasks);
      } else if (drawerMode === 'edit' && editingTask) {
        console.log('Updating task with user ID:', user.id);
        const response = await fetch(`/api/tasks/${editingTask.id}?user_id=${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        const tasksResponse = await fetch(`/api/tasks?user_id=${user.id}`);
        const updatedTasks = await tasksResponse.json();
        setTasks(updatedTasks);
      }
      
      setTaskDrawerOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const filteredTodayTasks = tasks.todayTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTasks = filteredTodayTasks.filter(task => task.completed);
  const completionPercentage = filteredTodayTasks.length > 0 
    ? (completedTasks.length / filteredTodayTasks.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" classNames={{label: "mx-auto mb-4"}} label="Loading tasks..." variant="wave" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "mr-80" : "mr-0"}`}>
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search your Lists"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Icon icon="solar:magnifer-bold-duotone" width={20} className="text-gray-400" />}
                  className="w-full"
                  size="lg"
                />
              </div>
            </div>

            <Card className="w-full">
              <CardHeader className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Today's tasks
                  </h2>
                  <ProgressCircle 
                    percentage={completionPercentage} 
                    size={60} 
                  />
                </div>
                <Button
                  color="success"
                  isIconOnly
                  size="lg"
                  onPress={handleCreateTask}
                >
                  <Icon icon="solar:add-circle-bold-duotone" width={24} />
                </Button>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTodayTasks.map((task) => (
                    <div key={task.id} className="group">
                      <TaskCard
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  ))}
                </div>
                {filteredTodayTasks.length === 0 && (
                  <div className="text-center py-8">
                    <Icon icon="solar:task-list-bold-duotone" width={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'No tasks match your search' : 'No tasks for today'}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {tasks.overdueTasks.length > 0 && (
              <Card className="w-full border-l-4 border-l-red-500">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon icon="solar:clock-circle-bold-duotone" width={24} className="text-red-500" />
                    Overdue Tasks
                    <span className="text-sm text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                      {tasks.overdueTasks.length}
                    </span>
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.overdueTasks.map((task) => (
                      <div key={task.id} className="group">
                        <TaskCard
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onRenew={handleRenewTask}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          showRenewButton={true}
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {tasks.upcomingTasks.length > 0 && (
              <Card className="w-full border-l-4 border-l-blue-500">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon icon="solar:calendar-bold-duotone" width={24} className="text-blue-500" />
                    Upcoming Tasks
                    <span className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      {tasks.upcomingTasks.length}
                    </span>
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.upcomingTasks.map((task) => (
                      <div key={task.id} className="group">
                        <TaskCard
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </main>

        <Button
          color="success"
          isIconOnly
          size="lg"
          className="fixed bottom-6 right-6 shadow-lg"
          onPress={handleCreateTask}
        >
          <Icon icon="solar:add-circle-bold-duotone" width={24} />
        </Button>
      </div>

      <TaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        mode={drawerMode}
      />
    </div>
  );
}
