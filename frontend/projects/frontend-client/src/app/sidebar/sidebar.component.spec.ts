import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { testComponentTranslation } from '../../mocks/test-functions';
import { provideTranslateTestingService } from '../../mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      SidebarComponent,
      'en',
      '#accounts',
      'Accounts list',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(SidebarComponent, 'pl', '#accounts', 'Lista kont');
  });
});
