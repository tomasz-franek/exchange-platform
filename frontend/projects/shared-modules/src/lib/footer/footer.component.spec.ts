import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testComponentTranslation } from '../../mocks/test-functions';
import { provideTranslateTestingService } from '../../../../frontend-client/src/mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      FooterComponent,
      'en',
      '#github-link',
      'Admin Exchange Platform',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      FooterComponent,
      'pl',
      '#github-link',
      'Administracja platformy wymiany',
    );
  });

  it('should render page in english (default)', () => {
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    fixture.detectChanges();
    testComponentTranslation(
      FooterComponent,
      'en',
      '#versionEmpty',
      'Version number : ',
    );
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    testComponentTranslation(
      FooterComponent,
      'pl',
      '#versionEmpty',
      'Numer wersji : ',
    );
  });
});
