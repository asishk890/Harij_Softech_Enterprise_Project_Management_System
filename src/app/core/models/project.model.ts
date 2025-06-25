
export type ProjectStatus = 'To Do' | 'In Progress' | 'Done';

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  managerId: number;
  team: number[];
}