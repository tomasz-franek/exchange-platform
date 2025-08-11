import {Component} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  templateUrl: './account-list.component.html',
  imports: [
    AccountMenu,
    MenuComponent
  ],
  styleUrl: './account-list.component.css'
})
export class AccountListComponent {

}
