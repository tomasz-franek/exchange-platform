import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMenu } from './property-menu';

describe('PropertyMenu', () => {
  let component: PropertyMenu;
  let fixture: ComponentFixture<PropertyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
