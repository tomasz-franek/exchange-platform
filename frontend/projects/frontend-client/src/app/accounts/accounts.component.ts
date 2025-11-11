import {Component} from '@angular/core';
import {AccountMenu} from './account-menu/account-menu';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  imports: [AccountMenu, MenuComponent]
})
export class AccountsComponent {
}
