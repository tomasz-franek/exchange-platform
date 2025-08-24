import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyMenu} from './property-menu';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {checkMenuChecked, testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMenu, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#labelAdminProperty', 'Admin Properties');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelAdminProperty', 'Ustawienia administratora');
  });

  [
    {id: 'adminProperty', description: 'Admin Property'},
    {id: 'invoiceProperty', description: 'Invoice Property'},
  ].forEach(({id, description}) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
