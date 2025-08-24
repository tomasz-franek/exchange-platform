import {Component} from '@angular/core';
import {VersionComponent} from '../version/version.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  imports: [
    VersionComponent,
    TranslatePipe
  ]
})
export class FooterComponent {
}
