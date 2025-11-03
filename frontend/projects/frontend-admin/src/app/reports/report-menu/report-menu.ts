import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './report-menu.css',
})
export class ReportMenu extends CheckedMenu {}
