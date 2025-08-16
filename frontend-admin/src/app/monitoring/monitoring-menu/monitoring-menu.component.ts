import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CheckedMenu } from '../../utils/checked-menu/checked-menu';

@Component({
  selector: 'app-monitoring-menu',
  templateUrl: './monitoring-menu.component.html',
  styleUrl: './monitoring-menu.component.css',
  imports: [FormsModule, RouterLink, TranslatePipe],
  standalone: true,
})
export class MonitoringMenuComponent extends CheckedMenu {}
