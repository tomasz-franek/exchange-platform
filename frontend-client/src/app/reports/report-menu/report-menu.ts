import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-menu',
  imports: [TranslatePipe, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './report-menu.html',
  styleUrl: './report-menu.css',
})
export class ReportMenu {
  @Input() checkedInput: string | undefined;
}
