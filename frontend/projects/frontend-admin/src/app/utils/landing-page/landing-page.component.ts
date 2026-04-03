import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent, UtilStore } from 'shared-modules';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [TranslatePipe, FooterComponent],
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  protected readonly router: Router = inject(Router);
  protected readonly store = inject(UtilStore);

  ngOnInit() {
    this.store.loadBuildInfo();
  }

  navigateToLogin() {
    this.router.navigate(['dashboard']);
  }
}
