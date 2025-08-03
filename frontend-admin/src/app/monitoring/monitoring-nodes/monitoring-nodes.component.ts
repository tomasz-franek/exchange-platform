import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-monitoring-nodes',
  templateUrl: './monitoring-nodes.component.html',
  styleUrl: './monitoring-nodes.component.css',
  imports: [
    TranslatePipe
  ],
  standalone: true
})
export class MonitoringNodesComponent {

}
