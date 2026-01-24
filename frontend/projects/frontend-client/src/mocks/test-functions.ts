import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

export function checkMenuChecked(fixture: ComponentFixture<any>, id: string) {
  const radioButton = fixture.debugElement.query(By.css(id));
  radioButton.nativeElement.click();
  fixture.detectChanges();

  const isChecked = fixture.nativeElement.querySelector(id).checked;
  expect(isChecked).toBeTrue();
}

export function testComponentTranslation(
  classType: any,
  language: string,
  selector: string,
  expected: string,
): void {
  let translateService = TestBed.inject(TranslateService);
  translateService.use(language);
  let fixture = TestBed.createComponent(classType);

  fixture.detectChanges();
  const idElement: HTMLElement = fixture.nativeElement.querySelector(selector);
  expect(idElement.innerText).toContain(expected);
}
