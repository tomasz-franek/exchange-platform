import { Component, signal, WritableSignal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BuildInfo } from '../api/model/buildInfo';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [TranslatePipe],
})
export class FooterComponent {
  public buildInfo: WritableSignal<BuildInfo | undefined> = signal(undefined);
}
