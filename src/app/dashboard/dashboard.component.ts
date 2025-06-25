
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from './dashboard.service';
import { DashboardData } from './dashboard.models';


import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);

  public dashboardData: Signal<DashboardData | undefined> = toSignal(
    this.dashboardService.getDashboardData()
  );

  
  public view: [number, number] = [700, 300];
  public colorScheme: string = 'vivid'; 
  public showLabels: boolean = true;
  public explodeSlices: boolean = false;
  public doughnut: boolean = true;
}