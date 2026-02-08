import { Injectable } from '@angular/core';
import {
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Injectable()
class FakeTranslateLoader implements TranslateLoader {
  constructor(private readonly translates: Record<string, TranslationObject>) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(this.translates[lang]);
  }
}

export function provideTranslateTestingService(
  translates: Record<string, TranslationObject>,
) {
  return provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useValue: new FakeTranslateLoader(translates),
    },
  });
}
