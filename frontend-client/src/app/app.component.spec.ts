import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { provideToastr } from 'ngx-toastr';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import assets_en from '../assets/i18n/en.json';
import assets_pl from '../assets/i18n/pl.json';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        FormBuilder,
        ReactiveFormsModule,
        provideMockStore({}),
        provideToastr(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend-client' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend-client');
  });
});
