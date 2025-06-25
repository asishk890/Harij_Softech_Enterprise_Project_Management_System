
export interface ChartData {
  name: string;
  value: number;
}


export interface DashboardData {
  kpis: {
    projectCount: number;
    activeUsers: number;
    overdueTasks: number;
  };
  projectsByStatus: ChartData[];
  tasksByPriority: ChartData[];
}