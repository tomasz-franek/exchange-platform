import {Component} from '@angular/core';
import {AccountMenu} from "./account-menu/account-menu";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  imports: [AccountMenu],
})
export class AccountsComponent {

}
