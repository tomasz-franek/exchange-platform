import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionComponent } from './version.component';
import { ApiService } from '../../../services/api/api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { initialMessageState } from '../../messages/state/message.reducers';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';

describe('Version', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionComponent, testTranslations()],
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
    const fixture = TestBed.createComponent(VersionComponent);
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
