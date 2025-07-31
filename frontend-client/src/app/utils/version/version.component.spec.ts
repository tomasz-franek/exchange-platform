import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionComponent } from './version.component';
import { ApiService } from '../../../services/api/api.service';
import { provideHttpClient } from '@angular/common/http';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialMessageState } from '../../messages/state/message.reducers';

describe('Version', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VersionComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [
        ApiService,
        provideHttpClient(),
        provideMockStore({ initialState: initialMessageState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#version');
    expect(tdElement.innerText).toContain('Version number : ');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#version');
    expect(tdElement.innerText).toContain('Numer wersji : ');
  });
});
