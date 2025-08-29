"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onRenew?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showRenewButton?: boolean;
}

const colorMap: { [key: string]: string } = {
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};

const priorityMap: { [key: string]: { color: string; label: string } } = {
  high: { color: 'danger', label: 'High' },
  medium: { color: 'warning', label: 'Medium' },
  low: { color: 'success', label: 'Low' },
};

export default function TaskCard({ task, onToggleComplete, onRenew, onEdit, onDelete, showRenewButton = false }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const router = useRouter();

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    onToggleComplete(task.id);
  };

  const handleRenew = () => {
    if (onRenew) {
      onRenew(task);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const formatTimeSlot = (timeSlot: string): string => {
    try {
      const timeParts = timeSlot.split(' - ');
      if (timeParts.length !== 2) return timeSlot;

      const startDate = new Date(timeParts[0]);
      const endDate = new Date(timeParts[1]);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return timeSlot;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      if (startDay.getTime() === today.getTime() && endDay.getTime() === today.getTime()) {
        return 'Today';
      } else if (startDay.getTime() === tomorrow.getTime() && endDay.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
      } else if (startDay.getTime() === yesterday.getTime() && endDay.getTime() === yesterday.getTime()) {
        return 'Yesterday';
      } else {
        const startMonth = startDate.getMonth() + 1;
        const startDayNum = startDate.getDate();
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        const startAMPM = startHour >= 12 ? 'PM' : 'AM';
        const startHour12 = startHour === 0 ? 12 : startHour > 12 ? startHour - 12 : startHour;
        const startTimeStr = `${startHour12}:${startMinute.toString().padStart(2, '0')}${startAMPM}`;

        const endMonth = endDate.getMonth() + 1;
        const endDayNum = endDate.getDate();
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();
        const endAMPM = endHour >= 12 ? 'PM' : 'AM';
        const endHour12 = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
        const endTimeStr = `${endHour12}:${endMinute.toString().padStart(2, '0')}${endAMPM}`;

        return `${startMonth}-${startDayNum} (${startTimeStr}) to ${endMonth}-${endDayNum} (${endTimeStr})`;
      }
    } catch (error) {
      return timeSlot;
    }
  };

  return (
    <Card 
      className={`w-full transition-all duration-300 hover:shadow-lg ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-full ${colorMap[task.color] || 'bg-gray-400'} rounded-full flex-shrink-0`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 
                className={`font-semibold text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
              
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="solar:menu-dots-bold" width={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Task actions" variant="flat">
                  <DropdownItem
                    key="edit"
                    description="Edit this task"
                    startContent={<Icon icon="solar:pen-new-round-bold-duotone" width={18} />}
                    onPress={handleEdit}
                  >
                    Edit Task
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    description="Permanently delete this task"
                    startContent={<Icon icon="solar:trash-bin-minimalistic-bold-duotone" width={18} />}
                    color="danger"
                    onPress={handleDelete}
                  >
                    Delete Task
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            
            <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Icon icon="solar:clock-circle-bold-duotone" width={14} />
                <span>{formatTimeSlot(task.timeSlot)}</span>
              </div>
              
              <Chip
                size="sm"
                variant="flat"
                className="text-xs"
              >
                {task.category}
              </Chip>
              
              <Chip
                size="sm"
                color={priorityMap[task.priority]?.color as any}
                variant="flat"
                className="text-xs"
              >
                {priorityMap[task.priority]?.label}
              </Chip>
              
              {task.overdueDays && (
                <Chip
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="text-xs"
                >
                  {task.overdueDays}d overdue
                </Chip>
              )}
            </div>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="pt-0 px-4 pb-4">
        <div className="flex items-center justify-between w-full">
          <Checkbox
            isSelected={isCompleted}
            onValueChange={handleToggleComplete}
            color="success"
            size="lg"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isCompleted ? 'Completed' : 'Mark as complete'}
            </span>
          </Checkbox>
          
          <div className="flex items-center gap-2">          
            {showRenewButton && onRenew && (
              <Tooltip content="Add to today's tasks">
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="solar:refresh-bold-duotone" width={16} />}
                  onPress={handleRenew}
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  Renew
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
