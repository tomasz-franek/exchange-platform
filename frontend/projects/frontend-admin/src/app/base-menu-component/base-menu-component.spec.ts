import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMenuComponent } from './base-menu-component';
import { PropertyStore } from '../properties/properties.signal-store';
import { mockPropertyStore } from '../../mocks/mock-store';
import { provideTranslateTestingService } from '../../mocks/fake-translation-loader';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';

describe('BaseMenuComponent', () => {
  let component: BaseMenuComponent;
  let fixture: ComponentFixture<BaseMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseMenuComponent],
      providers: [
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
