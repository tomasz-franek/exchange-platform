import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-monitoring-menu',
  templateUrl: './monitoring-menu.component.html',
  styleUrl: './monitoring-menu.component.css',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe
  ],
  standalone: true
})
export class MonitoringMenuComponent {
  @Input() checkedInput: string | undefined;
}
