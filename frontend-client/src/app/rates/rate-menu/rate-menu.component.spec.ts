import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMenuComponent } from './rate-menu.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { By } from '@angular/platform-browser';

describe('RateMenuComponent', () => {
  let component: RateMenuComponent;
  let fixture: ComponentFixture<RateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMenuComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en
        ).withTranslations('pl', assets_pl)
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(RateMenuComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelRateList');
    expect(idElement.innerText).toContain('List rates');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(RateMenuComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelRateList');
    expect(idElement.innerText).toContain('List kursów');
  });

  [
    { id: 'rateList', description: 'Rate List' }
  ].forEach(
    ({ id, description }) => {
      it(`should check the menu option ${description} when clicked`, () => {
        const radioButton = fixture.debugElement.query(By.css(`#${id}`));
        radioButton.nativeElement.click();
        fixture.detectChanges();

        const isChecked = fixture.nativeElement.querySelector(`#${id}`).checked;
        expect(isChecked).toBeTrue();
      });
    }
  );
});
