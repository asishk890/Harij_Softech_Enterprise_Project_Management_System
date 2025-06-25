
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  projectId: number;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string; 
}