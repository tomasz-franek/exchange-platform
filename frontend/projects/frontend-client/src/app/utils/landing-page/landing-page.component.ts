import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {ButtonModule} from 'primeng/button';
import {UtilStore} from '../utils.signal-store';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [TranslatePipe, FooterComponent, ButtonModule],
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  features: string[] = ['Fast exchange', 'Define own exchange ratio'];
  protected readonly router: Router = inject(Router);
  protected readonly store = inject(UtilStore);

  constructor() {
    this.store.loadBuildInfo();
  }

  navigateToLogin() {
    this.router.navigate(['dashboard']);
  }
}
