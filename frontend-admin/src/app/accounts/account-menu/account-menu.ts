import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './account-menu.css'
})
export class AccountMenu {

}
