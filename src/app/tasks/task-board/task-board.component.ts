
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);


  public todo: Task[] = [];
  public inProgress: Task[] = [];
  public done: Task[] = [];


  public readonly connectedTo = ['todo-list', 'inprogress-list', 'done-list'];

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
      const projectId = +id;
      this.loadTasks(projectId);
    }
  }

  private loadTasks(projectId: number): void {
    this.taskService.getTasksForProject(projectId).subscribe((tasks: Task[]) => {
      this.todo = tasks.filter(t => t.status === 'To Do');
      this.inProgress = tasks.filter(t => t.status === 'In Progress');
      this.done = tasks.filter(t => t.status === 'Done');
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);

 
      task.status = newStatus;

      this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
        error: () => {
       
          console.error(`Failed to update status for task ${task.id}`);
          this.loadTasks(task.projectId);
        }
      });
    }
  }

  private getStatusFromContainerId(containerId: string): TaskStatus {

    switch (containerId) {
      case 'inprogress-list': return 'In Progress';
      case 'done-list': return 'Done';
      default: return 'To Do';
    }
  }
}