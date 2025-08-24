import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringMenuComponent} from './monitoring-menu.component';
import {ActivatedRoute} from '@angular/router';
import {mockRoute} from '../../../mocks/activated-route-mock';
import {checkMenuChecked, testComponentTranslation, testTranslations,} from '../../../mocks/test-functions';

describe('MonitoringMenuComponent', () => {
  let component: MonitoringMenuComponent;
  let fixture: ComponentFixture<MonitoringMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringMenuComponent, testTranslations()],
      providers: [{provide: ActivatedRoute, useValue: mockRoute}],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#labelNodes', 'System components');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#labelNodes', 'Komponenty systemu');
  });

  [{id: 'nodes', description: 'Nodes'}].forEach(({id, description}) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
