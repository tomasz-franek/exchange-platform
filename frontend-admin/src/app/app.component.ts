import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterLink, RouterOutlet, TranslatePipe]
})
export class AppComponent {
  title = 'frontend-admin';
}
