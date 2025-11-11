import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

}
