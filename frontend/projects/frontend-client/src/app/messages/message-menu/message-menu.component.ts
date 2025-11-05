import {Component, inject, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-message-menu',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Menubar
  ],
  templateUrl: './message-menu.component.html',
  styleUrl: './message-menu.component.css'
})
export class MessageMenuComponent implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

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
