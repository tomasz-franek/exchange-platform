import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMenu } from './property-menu';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  checkMenuChecked,
  testTranslations,
} from '../../../mocks/test-functions';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMenu, testTranslations()],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertyMenu);
    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelAdminProperty',
    );
    expect(idElement.innerText).toContain('Admin Properties');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertyMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement = fixture.nativeElement.querySelector(
      '#labelAdminProperty',
    );
    expect(idElement.innerText).toContain('Ustawienia administratora');
  });

  [
    { id: 'adminProperty', description: 'Admin Property' },
    { id: 'invoiceProperty', description: 'Invoice Property' },
  ].forEach(({ id, description }) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
