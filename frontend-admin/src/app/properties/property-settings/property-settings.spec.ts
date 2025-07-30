import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySettings } from './property-settings';

describe('PropertySettings', () => {
  let component: PropertySettings;
  let fixture: ComponentFixture<PropertySettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertySettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
