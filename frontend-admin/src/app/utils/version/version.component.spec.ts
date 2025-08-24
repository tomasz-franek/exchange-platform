import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VersionComponent} from './version.component';
import {ApiService} from '../../../services/api.service';
import {provideMockStore} from '@ngrx/store/testing';
import {initialUtilState} from '../state/util.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('Version', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionComponent, testTranslations()],
      providers: [
        ApiService,
        provideMockStore({initialState: initialUtilState}),
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
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'branchName',
      commitHash: 'commitHash',
      buildTime: 'buildTime',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
    };
    fixture.detectChanges();
    testComponentTranslation(fixture, 'en', '#version', 'Version number : ');
  });

  it('should render page in proper language', () => {
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'branchName',
      commitHash: 'commitHash',
      buildTime: 'buildTime',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
    };
    fixture.detectChanges();
    testComponentTranslation(fixture, 'pl', '#version', 'Numer wersji : ');
  });
});
