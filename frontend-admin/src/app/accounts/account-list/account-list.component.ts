import {Component} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';

@Component({
  selector: 'app-account-list',
  standalone: true,
  templateUrl: './account-list.component.html',
  imports: [
    AccountMenu
  ],
  styleUrl: './account-list.component.css'
})
export class AccountListComponent {

}
