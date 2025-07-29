import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './account-menu.css'
})
export class AccountMenu {

}
