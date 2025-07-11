import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Version } from './version';

describe('Version', () => {
  let component: Version;
  let fixture: ComponentFixture<Version>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Version]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Version);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
