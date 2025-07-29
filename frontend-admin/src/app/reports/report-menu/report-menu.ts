import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './report-menu.css'
})
export class ReportMenu {

}
