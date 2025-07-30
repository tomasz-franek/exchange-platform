import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyInvoice } from './property-invoice';

describe('PropertyInvoice', () => {
  let component: PropertyInvoice;
  let fixture: ComponentFixture<PropertyInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
