import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SidebarComponent} from './sidebar.component';
import {testComponentTranslation, testTranslations,} from '../../mocks/test-functions';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    testComponentTranslation(SidebarComponent, 'en', '#accounts', 'Accounts list');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(SidebarComponent, 'pl', '#accounts', 'Lista kont');
  });
});
