import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BuildInfo } from '../../api/model/buildInfo';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true,
})
export class FooterComponent {
  @Input() buildInfo: BuildInfo | undefined = undefined;
}
