import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-message-menu',
  templateUrl: './message-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './message-menu.scss',
})
export class MessageMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_LIST'),
        routerLink: '/messages/message-list',
        id: 'messageList',
      },
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_ADD'),
        routerLink: '/messages/message-add',
        id: 'messageAdd',
      },
    ];
  }
}
