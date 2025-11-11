import {Component} from '@angular/core';
import {ReportMenu} from './report-menu/report-menu';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  imports: [ReportMenu, MenuComponent]
})
export class ReportsComponent {
}
