import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringMenuComponent} from './monitoring-menu.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {TranslateService} from '@ngx-translate/core';
import {By} from '@angular/platform-browser';

describe('MonitoringMenuComponent', () => {
  let component: MonitoringMenuComponent;
  let fixture: ComponentFixture<MonitoringMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringMenuComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonitoringMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MonitoringMenuComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelNodes');
    expect(idElement.innerText).toContain('System components');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MonitoringMenuComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelNodes');
    expect(idElement.innerText).toContain('Komponenty systemu');
  });

  [
    {id: 'nodes', description: 'Nodes'},
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
