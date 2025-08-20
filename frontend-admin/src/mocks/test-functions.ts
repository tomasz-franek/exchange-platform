import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';

export function checkMenuChecked(fixture: ComponentFixture<any>, id: string) {
  const radioButton = fixture.debugElement.query(By.css(id));
  radioButton.nativeElement.click();
  fixture.detectChanges();

  const isChecked = fixture.nativeElement.querySelector(id).checked;
  expect(isChecked).toBeTrue();
}

export function testTranslations(): TranslateTestingModule {
  return TranslateTestingModule.withTranslations(
    'en',
    assets_en,
  ).withTranslations('pl', assets_pl);
}
