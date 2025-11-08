import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckedMenu} from './checked-menu';
import {testTranslations} from '../../mocks/test-functions';

describe('CheckedMenu', () => {
  let component: CheckedMenu;
  let fixture: ComponentFixture<CheckedMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckedMenu, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckedMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
