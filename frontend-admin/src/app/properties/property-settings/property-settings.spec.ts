import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertySettings} from './property-settings';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../mocks/activated-route-mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('PropertySettings', () => {
  let component: PropertySettings;
  let fixture: ComponentFixture<PropertySettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySettings,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertySettings);
    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Admin Properties');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertySettings);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Ustawienia administratora');
  });
});
