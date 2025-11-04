import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {BuildInfo} from '../api';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [
    TranslatePipe
  ]
})
export class FooterComponent {
  @Input() buildInfo: BuildInfo | undefined = undefined;
}
