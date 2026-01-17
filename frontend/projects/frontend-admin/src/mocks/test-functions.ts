import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';
import assets_es from '../assets/i18n/es.json';
import assets_hi from '../assets/i18n/hi.json';
import assets_zhcn from '../assets/i18n/zhcn.json';
import { TranslateService } from '@ngx-translate/core';
import { expect } from 'vitest';

export function checkMenuChecked(fixture: ComponentFixture<any>, id: string) {
  const radioButton = fixture.debugElement.query(By.css(id));
  radioButton.nativeElement.click();
  fixture.detectChanges();

  const isChecked = fixture.nativeElement.querySelector(id).checked;
  expect(isChecked).eq(true);
}

export function testTranslations(): TranslateTestingModule {
  return TranslateTestingModule.withTranslations('en', assets_en)
    .withTranslations('pl', assets_pl)
    .withTranslations('es', assets_es)
    .withTranslations('hi', assets_hi)
    .withTranslations('zhcn', assets_zhcn);
}

export function testComponentTranslation(
  classType: any,
  language: string,
  selector: string,
  expected: string,
): void {
  let translateService = TestBed.inject(TranslateService);
  translateService.use(language);
  console.log('-------------');
  console.log('currentLang: ', translateService.currentLang);
  console.log('languages: ', translateService.getLangs());
  let fixture = TestBed.createComponent(classType);

  fixture.detectChanges(true);
  const idElement: HTMLElement = fixture.nativeElement.querySelector(selector);
  console.log(idElement.textContent);
  console.log(expected);
  console.log('-------------');
  expect(idElement.textContent.trim()).eq(expected);
}
