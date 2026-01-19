import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMenuComponent } from './base-menu-component';
import { testTranslations } from '../../mocks/test-functions';
import { PropertyStore } from '../properties/properties.signal-store';
import { mockPropertyStore } from '../../mocks/mock-store';

describe('BaseMenuComponent', () => {
  let component: BaseMenuComponent;
  let fixture: ComponentFixture<BaseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseMenuComponent, testTranslations()],
      providers: [{ provide: PropertyStore, useValue: mockPropertyStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
