import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-menu',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './report-menu.html',
  styleUrl: './report-menu.css',
})
export class ReportMenu {}
