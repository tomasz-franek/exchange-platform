import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringNodesComponent} from './monitoring-nodes.component';
import {TranslateService} from '@ngx-translate/core';
import {TranslateTestingModule} from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import {provideMockStore} from '@ngrx/store/testing';
import {initialMonitoringState} from '../state/monitoring.reducers';

describe('MonitoringNodesComponent', () => {
  let component: MonitoringNodesComponent;
  let fixture: ComponentFixture<MonitoringNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringNodesComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        provideMockStore({initialState: initialMonitoringState}),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MonitoringNodesComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatus');
    expect(idElement.innerText).toContain('Status module');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MonitoringNodesComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelStatus');
    expect(idElement.innerText).toContain('Status modułu');
  });
});
