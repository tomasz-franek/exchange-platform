import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [
    TranslatePipe,
    FooterComponent
  ],
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  protected readonly router: Router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/login']); // Adjust the route as necessary
  }
}
