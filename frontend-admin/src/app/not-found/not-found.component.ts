import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
