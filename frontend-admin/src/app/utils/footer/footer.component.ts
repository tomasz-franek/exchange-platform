import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {BuildInfo} from '../../api/model/buildInfo';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  imports: [
    TranslatePipe
  ]
})
export class FooterComponent {
  @Input() buildInfo: BuildInfo | undefined = undefined;
}
