import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';
import assets_es from '../assets/i18n/es.json';
import assets_hi from '../assets/i18n/hi.json';
import { TranslateService } from '@ngx-translate/core';

export function checkMenuChecked(fixture: ComponentFixture<any>, id: string) {
  const radioButton = fixture.debugElement.query(By.css(id));
  radioButton.nativeElement.click();
  fixture.detectChanges();

  const isChecked = fixture.nativeElement.querySelector(id).checked;
  expect(isChecked).toBeTrue();
}

export function testTranslations() {
  return TranslateTestingModule.withTranslations('en', assets_en)
    .withTranslations('pl', assets_pl)
    .withTranslations('es', assets_es)
    .withTranslations('hi', assets_hi);
}

export function testComponentTranslation(
  fixture: any,
  language: string,
  selector: string,
  expected: string,
) {
  const translateService = TestBed.inject(TranslateService);
  translateService.use(language);

  fixture.detectChanges();
  const idElement: HTMLElement = fixture.nativeElement.querySelector(selector);
  expect(idElement.innerText).toContain(expected);
}
