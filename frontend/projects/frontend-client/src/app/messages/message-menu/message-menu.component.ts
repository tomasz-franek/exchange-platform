import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-message-menu',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Menubar
  ],
  templateUrl: './message-menu.component.html',
  styleUrl: './message-menu.component.scss'
})
export class MessageMenuComponent extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_LIST'),
        routerLink: '/messages/message-list',
        id: 'messageList'
      }
    ];
  }
}
