import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

}
