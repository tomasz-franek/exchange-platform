import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../../frontend-client/src/mocks/fake-translation-loader';
import assets_en from '../../../src/assets/i18n/en.json';
import assets_pl from '../../../src/assets/i18n/pl.json';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      NotFoundComponent,
      'en',
      '#notFound',
      'Page not found',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      NotFoundComponent,
      'pl',
      '#notFound',
      'Nie znaleziono strony',
    );
  });
});
