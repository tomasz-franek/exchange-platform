import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from "./utils/footer/footer.component";
import {MenuComponent} from './utils/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, FooterComponent, MenuComponent],
  standalone: true,
})
export class AppComponent {
  title = 'frontend-admin';
}
