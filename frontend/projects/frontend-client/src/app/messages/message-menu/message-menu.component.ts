import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-message-menu',
  imports: [ReactiveFormsModule, FormsModule, Menubar],
  templateUrl: './message-menu.component.html',
  styleUrl: './message-menu.component.scss',
})
export class MessageMenuComponent extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.MESSAGES.MESSAGE_LIST'),
        routerLink: '/messages/message-list',
        id: 'messageList',
      },
    ];
  }
}
