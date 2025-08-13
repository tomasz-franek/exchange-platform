import {Component} from '@angular/core';
import {ReportMenu} from "./report-menu/report-menu";
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  imports: [ReportMenu, MenuComponent],
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

}
