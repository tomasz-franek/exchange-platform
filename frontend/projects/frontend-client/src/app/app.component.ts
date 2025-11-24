import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PrimeNG} from 'primeng/config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TranslateModule, ToastModule],
  standalone: true,
})
export class AppComponent {
  title = 'frontend-client';
  private readonly translateService: TranslateService = inject(TranslateService);
  private config: PrimeNG = inject(PrimeNG);

  constructor() {
    this.translateService.setDefaultLang('en');
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
