import { Injectable } from '@angular/core';
import {
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';

@Injectable()
class FakeTranslateLoader implements TranslateLoader {
  private translations: { [key: string]: any } = {
    en: assets_en,
    pl: assets_pl,
  };

  getTranslation(lang: string): Observable<TranslationObject> {
    // Return the imported translations for the requested language
    const translation = this.translations[lang];

    if (translation) {
      return of(translation);
    }

    // Fallback to empty object if language not found
    return of({});
  }
}

export function provideTranslateTestingServiceShared() {
  return provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useValue: new FakeTranslateLoader(),
    },
  });
}
