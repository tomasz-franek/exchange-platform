import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from 'primeng/toast';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ToastModule],
  standalone: true,
})
export class AppComponent {
  title = 'frontend-client';
}
