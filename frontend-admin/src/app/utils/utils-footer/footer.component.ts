import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VersionComponent} from '../utils-version/version.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  imports: [
    VersionComponent,
    TranslatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent {
}
