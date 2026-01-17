import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import {
  Language,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { PropertyStore } from './properties/properties.signal-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TranslateModule, ToastModule],
  standalone: true,
})
export class AppComponent {
  title = 'frontend-client';
  protected readonly store = inject(PropertyStore);
  constructor(
    private primeng: PrimeNG,
    private translateService: TranslateService,
  ) {
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty && userProperty.language != undefined) {
        const language: Language = userProperty.language.toLowerCase();
        this.translateService.use(language);
      }
    });
  }
}
