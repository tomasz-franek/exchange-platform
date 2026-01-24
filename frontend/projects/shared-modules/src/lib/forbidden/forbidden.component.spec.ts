import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenComponent } from './forbidden.component';
import { testComponentTranslation } from '../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../../frontend-client/src/mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      ForbiddenComponent,
      'en',
      '#forbidden',
      '403 - Forbidden.',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      ForbiddenComponent,
      'pl',
      '#forbidden',
      '403 - Brak dostępu.',
    );
  });
});
