import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialUtilState } from '../state/util.reducers';
import { TranslateService } from '@ngx-translate/core';
import { testTranslations } from '../../../mocks/test-functions';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, testTranslations()],
      providers: [provideMockStore({ initialState: initialUtilState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const tdElement: HTMLElement = fixture.nativeElement.querySelector('#name');
    expect(tdElement.innerText).toContain('Admin Exchange Platform');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const tdElement: HTMLElement = fixture.nativeElement.querySelector('#name');
    expect(tdElement.innerText).toContain('Administracja platformy wymiany');
  });
});
