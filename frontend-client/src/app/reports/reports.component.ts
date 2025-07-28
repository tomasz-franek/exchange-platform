import { Component } from '@angular/core';
import { ReportMenu } from './report-menu/report-menu';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  imports: [ReportMenu],
})
export class ReportsComponent {}
