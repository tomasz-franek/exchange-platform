import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-message-menu',
  templateUrl: './message-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './message-menu.css',
})
export class MessageMenu extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_LIST'),
        routerLink: '/messages/message-list',
        id: 'messageList'
      },
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_ADD'),
        routerLink: '/messages/message-add',
        id: 'messageAdd'
      },
    ];
  }
}
