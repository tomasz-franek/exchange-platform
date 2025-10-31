import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterComponent} from './footer.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideMockStore} from '@ngrx/store/testing';
import {initialUtilState} from '../state/util.reducers';
import {testComponentTranslation, testTranslations} from '../../../mocks/test-functions';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, testTranslations()],
      providers: [provideMockStore({initialState: initialUtilState})],
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
    testComponentTranslation(fixture, 'en', '#name', 'Admin Exchange Platform');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#name', 'Administracja platformy wymiany');
  });

  it('should render page in english (default)', () => {
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    fixture.detectChanges();
    testComponentTranslation(fixture, 'en', '#version', 'Version number : ');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    component.buildInfo = {
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    };
    testComponentTranslation(fixture, 'pl', '#version', 'Numer wersji : ');
  });
});
