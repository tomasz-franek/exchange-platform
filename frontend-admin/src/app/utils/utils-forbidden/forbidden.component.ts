import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-utils-forbidden',
  templateUrl: './forbidden.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {

}
