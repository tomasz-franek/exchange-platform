import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMenu } from './message-menu';

describe('MessageMenu', () => {
  let component: MessageMenu;
  let fixture: ComponentFixture<MessageMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
