import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateService} from "@ngx-translate/core";
import {TranslateTestingModule} from "ngx-translate-testing";
import assets_en from "../../assets/i18n/en.json";
import assets_pl from "../../assets/i18n/pl.json";
import {MessagesComponent} from "./messages.component";
import {ActivatedRoute} from "@angular/router";
import {mockRoute} from "../mocks/activated-route-mock";


describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesComponent,
        TranslateTestingModule.withTranslations(
            'en',
            assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MessagesComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#labelMessageList');
    expect(idElement.innerText).toContain('Message list');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MessagesComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
        fixture.nativeElement.querySelector('#labelMessageList');
    expect(idElement.innerText).toContain('Lista wiadomości');
  });
});
