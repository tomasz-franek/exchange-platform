import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyMenu} from './property-menu';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {By} from '@angular/platform-browser';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMenu,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
      .compileComponents();

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
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Admin Properties');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertyMenu);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Ustawienia administratora');
  });


  [
    {id: 'adminProperty', description: 'Admin Property'},
    {id: 'invoiceProperty', description: 'Invoice Property'},
  ].forEach(({id, description}) => {
    it(`should check the menu option ${description} when clicked`, () => {
      const radioButton = fixture.debugElement.query(By.css(`#${id}`));
      radioButton.nativeElement.click();
      fixture.detectChanges();

      const isChecked = (document.getElementById(id) as HTMLInputElement).checked;
      expect(isChecked).toBeTrue();
    });
  });
});
