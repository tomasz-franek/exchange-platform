import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringMenuComponent } from './monitoring-menu.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import {
  testComponentTranslation,
  testTranslations,
} from '../../../mocks/test-functions';
import { PropertyStore } from '../../properties/properties.signal-store';
import { mockPropertyStore } from '../../../mocks/mock-store';

describe('MonitoringMenuComponent', () => {
  let component: MonitoringMenuComponent;
  let fixture: ComponentFixture<MonitoringMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringMenuComponent, testTranslations()],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PropertyStore, useValue: mockPropertyStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(
      MonitoringMenuComponent,
      'en',
      '#nodes',
      'System components',
    );
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      MonitoringMenuComponent,
      'pl',
      '#nodes',
      'Komponenty systemu',
    );
  });

  // [{id: 'nodes', description: 'Nodes'}].forEach(({id, description}) => {
  //   it(`should check the menu option ${description} when clicked`, () => {
  //     checkMenuChecked(fixture, `#${id}`);
  //   });
  // });
});
