import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FooterComponent, UtilStore } from 'shared-modules';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [TranslatePipe, FooterComponent, ButtonModule],
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  features: string[] = ['Fast Exchange', 'Define Own Exchange Ratio', 'Peer-to-Peer Cryptocurrency Exchange', 'Reading Transaction Reports', 'Generate Reports', 'Exchange Documents', 'Secure Transactions', 'Real-Time Updates'];
  protected readonly router: Router = inject(Router);
  protected readonly store = inject(UtilStore);

  constructor() {
    this.store.loadBuildInfo();
  }

  navigateToLogin() {
    this.router.navigate(['dashboard']);
  }
}
