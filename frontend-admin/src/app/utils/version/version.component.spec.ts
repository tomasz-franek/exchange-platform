import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionComponent } from './version.component';
import { ApiService } from '../../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { initialUtilState } from '../state/util.reducers';
import { testTranslations } from '../../../mocks/test-functions';

describe('Version', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionComponent, testTranslations()],
      providers: [
        ApiService,
        provideMockStore({ initialState: initialUtilState }),
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
