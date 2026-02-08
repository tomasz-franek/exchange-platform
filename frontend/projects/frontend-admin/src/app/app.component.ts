import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Language,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { PropertyStore } from './properties/properties.signal-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TranslateModule, ToastModule],
})
export class AppComponent {
  title = 'frontend-admin';
  protected readonly store = inject(PropertyStore);
  constructor(
    private readonly primeng: PrimeNG,
    private readonly translateService: TranslateService,
  ) {
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty?.language != undefined) {
        const language: Language = userProperty.language.toLowerCase();
        this.translateService.use(language);
      }
    });
  }
}
