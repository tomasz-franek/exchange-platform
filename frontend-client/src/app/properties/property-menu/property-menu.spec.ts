import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMenu } from './property-menu';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { TranslateService } from '@ngx-translate/core';
import { checkMenuChecked, testTranslations } from '../../../mocks/test-functions';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PropertyMenu,
        testTranslations()
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertyMenu);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelUserProperty');
    expect(idElement.innerText).toContain('User property');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertyMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelUserProperty');
    expect(idElement.innerText).toContain('Ustawienia użytkownika');
  });

  [
    { id: 'userProperty', description: 'User property' },
    { id: 'addressProperty', description: 'Address property' }
  ].forEach(
    ({ id, description }) => {
      it(`should check the menu option ${description} when clicked`, () => {
        checkMenuChecked(fixture, `#${id}`);
      });
    }
  );
});
