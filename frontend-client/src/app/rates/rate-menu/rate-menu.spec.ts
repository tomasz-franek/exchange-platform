import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMenu } from './rate-menu';

describe('RateMenu', () => {
  let component: RateMenu;
  let fixture: ComponentFixture<RateMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
