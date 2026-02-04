import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedMenu } from './checked-menu';
import { provideTranslateTestingService } from '../../../../frontend-client/src/mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('CheckedMenu', () => {
  let component: CheckedMenu;
  let fixture: ComponentFixture<CheckedMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckedMenu],
      providers: [
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckedMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
