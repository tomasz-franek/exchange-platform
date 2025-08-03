import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MonitoringMenuComponent} from './monitoring-menu.component';

describe('MonitoringMenuComponent', () => {
  let component: MonitoringMenuComponent;
  let fixture: ComponentFixture<MonitoringMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
