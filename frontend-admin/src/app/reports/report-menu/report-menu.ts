import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './report-menu.css',
})
export class ReportMenu {
  @Input() checkedInput: string | undefined;
}
