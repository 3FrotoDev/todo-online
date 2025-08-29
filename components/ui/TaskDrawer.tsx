"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  useDisclosure,
  DatePicker,
} from "@heroui/react";
import { now, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  timeSlot: string;
  category: string;
  priority: string;
  completed: boolean;
  description: string;
  overdueDays?: number;
}

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; 
  onSave: (task: Omit<Task, 'id' | 'completed' | 'overdueDays'>) => void;
  mode: 'create' | 'edit';
}

const categories = [
  { key: 'work', label: 'Work', color: 'blue' },
  { key: 'health', label: 'Health', color: 'purple' },
  { key: 'learning', label: 'Learning', color: 'teal' },
  { key: 'personal', label: 'Personal', color: 'pink' },
  { key: 'finance', label: 'Finance', color: 'green' },
  { key: 'travel', label: 'Travel', color: 'yellow' },
];

const priorities = [
  { key: 'high', label: 'High', color: 'danger' },
  { key: 'medium', label: 'Medium', color: 'warning' },
  { key: 'low', label: 'Low', color: 'success' },
];

export default function TaskDrawer({ isOpen, onClose, task, onSave, mode }: TaskDrawerProps) {
  const [formData, setFormData] = useState({
    title: '',
    startDateTime: now(getLocalTimeZone()),
    endDateTime: now(getLocalTimeZone()),
    category: '',
    priority: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const nowDate = now(getLocalTimeZone());
  const minDate = nowDate;
  const maxDate = nowDate.add({ years: 1 });

  useEffect(() => {
    if (task && mode === 'edit') {
      const timeParts = task.timeSlot.split(' - ');
      const startDateTime = timeParts[0] || task.timeSlot;
      const endDateTime = timeParts[1] || task.timeSlot;

      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      setFormData({
        title: task.title,
        startDateTime: now(getLocalTimeZone()).set({
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          hour: startDate.getHours(),
          minute: startDate.getMinutes(),
          second: 0,
          millisecond: 0
        }),
        endDateTime: now(getLocalTimeZone()).set({
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          day: endDate.getDate(),
          hour: endDate.getHours(),
          minute: endDate.getMinutes(),
          second: 0,
          millisecond: 0
        }),
        category: task.category,
        priority: task.priority,
        description: task.description,
      });
    } else {
      const endDate = nowDate.add({ hours: 24 }); 

      setFormData({
        title: '',
        startDateTime: nowDate,
        endDateTime: endDate,
        category: '',
        priority: '',
        description: '',
      });
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.description.trim() && mode === 'create') {
      newErrors.description = 'Description is required';
    }

    if (formData.startDateTime.compare(nowDate) < 0 && mode === 'create') {
      newErrors.startDateTime = 'Start time cannot be in the past';
    }

    if (formData.startDateTime.compare(maxDate) > 0) {
      newErrors.startDateTime = 'Start time cannot be more than 1 year in the future';
    }

    if (formData.endDateTime.compare(maxDate) > 0 && mode === 'create') {
      newErrors.endDateTime = 'End time cannot be more than 1 year in the future';
    }

    if (formData.startDateTime.compare(formData.endDateTime) >= 0) {
      newErrors.endDateTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const startISO = formData.startDateTime.toDate().toISOString();
      const endISO = formData.endDateTime.toDate().toISOString();
      const timeSlot = `${startISO} - ${endISO}`;

      const taskData = {
        title: formData.title,
        timeSlot,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
      };
      onSave(taskData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateTime = (dateTime: ZonedDateTime) => {
    const dateObj = dateTime.toDate();
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    return dateObj.toLocaleDateString('en-US', options);
  };

  return (
    <Drawer
      isOpen={isOpen}
      size="sm"
      onClose={onClose}
      placement="right"
      disableAnimation
      backdrop="blur"
    >
      <DrawerContent>
        <DrawerHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === 'create' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
              <Icon
                icon={mode === 'create' ? "solar:add-circle-bold-duotone" : "solar:pen-new-round-bold-duotone"}
                width={24}
                className={mode === 'create' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Add a new task to your list' : 'Update your task details'}
              </p>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className="px-6 py-6">
          <div className="space-y-6">
            <div>
              <Input
                placeholder="Enter task title"
                label="Task Title"
                isRequired
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                size="lg"
                className="w-full"
              />
            </div>

            <div>
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                isRequired
                visibleMonths={1}
                label="Start Date & Time"
                variant="bordered"
                value={formData.startDateTime as any}
                onChange={(dateTime) => handleInputChange('startDateTime', dateTime)}
                isInvalid={!!errors.startDateTime}
                errorMessage={errors.startDateTime}
                minValue={minDate as any}
                maxValue={maxDate as any}
              />
            </div>

            <div>
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                isRequired
                visibleMonths={1}
                label="End Date & Time"
                variant="bordered"
                value={formData.endDateTime as any}
                onChange={(dateTime) => handleInputChange('endDateTime', dateTime)}
                isInvalid={!!errors.endDateTime}
                errorMessage={errors.endDateTime}
                minValue={formData.startDateTime as any}
                maxValue={maxDate as any}
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              Task scheduled for: {formatDateTime(formData.startDateTime)} to {formatDateTime(formData.endDateTime)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  placeholder="Select category"
                  isRequired
                  label="Category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onSelectionChange={(keys) => handleInputChange('category', Array.from(keys)[0] as string)}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category}
                  size="lg"
                  className="w-full"
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} textValue={cat.label}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cat.color === 'blue' ? 'bg-blue-500' :
                          cat.color === 'purple' ? 'bg-purple-500' :
                            cat.color === 'teal' ? 'bg-teal-500' :
                              cat.color === 'pink' ? 'bg-pink-500' :
                                cat.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  placeholder="Select priority"
                  isRequired
                  label="Priority"
                  selectedKeys={formData.priority ? [formData.priority] : []}
                  onSelectionChange={(keys) => handleInputChange('priority', Array.from(keys)[0] as string)}
                  isInvalid={!!errors.priority}
                  errorMessage={errors.priority}
                  size="lg"
                  className="w-full"
                >
                  {priorities.map((priority) => (
                    <SelectItem key={priority.key} textValue={priority.label}>
                      <Chip color={priority.color as any} variant="flat" size="sm">
                        {priority.label}
                      </Chip>
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Textarea
                placeholder="Enter task description"
                required
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
                size="lg"
                className="w-full"
                minRows={3}
              />
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 w-full">
            <Button
              variant="light"
              onPress={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              color={mode === 'create' ? 'success' : 'primary'}
              onPress={handleSave}
              className="flex-1"
              startContent={
                <Icon
                  icon={mode === 'create' ? "solar:add-circle-bold-duotone" : "solar:check-circle-bold-duotone"}
                  width={20}
                />
              }
            >
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
