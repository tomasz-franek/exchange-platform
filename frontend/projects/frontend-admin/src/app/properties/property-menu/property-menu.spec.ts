import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMenu } from './property-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { testComponentTranslation } from '../../../mocks/test-functions';
import { PropertyStore } from '../properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';
import { provideTranslateTestingService } from '../../../mocks/fake-translation-loader';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMenu],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
        provideTranslateTestingService({
          en: assets_en,
          pl: assets_pl,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(
      PropertyMenu,
      'en',
      '#adminProperty',
      'Admin Properties',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      PropertyMenu,
      'pl',
      '#adminProperty',
      'Ustawienia administratora',
    );
  });

  // [
  //   {id: 'adminProperty', description: 'Admin Property'},
  //   {id: 'addressProperty', description: 'Invoice Property'},
  //   {id: 'systemProperty', description: 'System Property'},
  //   {id: 'currencyProperty', description: 'Currency Property'},
  // ].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
