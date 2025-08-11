import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertiesComponent} from './properties.component';
import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from "../../mocks/activated-route-mock";
import Keycloak from 'keycloak-js';
import {MockKeycloak} from '../../mocks/mock-keycloak';
import {KEYCLOAK_EVENT_SIGNAL} from 'keycloak-angular';
import {MOCK_KEYCLOAK_EVENT_SIGNAL} from '../../mocks/mock-keycloak-signal';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: Keycloak, useClass: MockKeycloak},
        {provide: KEYCLOAK_EVENT_SIGNAL, useValue: MOCK_KEYCLOAK_EVENT_SIGNAL}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(PropertiesComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Properties');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(PropertiesComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelAdminProperty');
    expect(idElement.innerText).toContain('Ustawienia');
  });

});
