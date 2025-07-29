import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotFoundComponent} from './not-found.component';
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from "../mocks/activated-route-mock";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent,
        TranslateTestingModule.withTranslations(
            'en',
            assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(NotFoundComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#notFound');
    expect(idElement.innerText).toContain('Page not found');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#notFound');
    expect(idElement.innerText).toContain('Nie znaleziono strony');
  });
});
