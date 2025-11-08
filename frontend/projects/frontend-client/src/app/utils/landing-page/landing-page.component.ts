import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {BuildInfo} from '../../../../../shared-modules/src/lib/api';
import {Store} from '@ngrx/store';
import {selectBuildInfo, UtilState} from '../state/util.selectors';
import {loadBuildInfoAction} from '../state/util.actions';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [TranslatePipe, FooterComponent, ButtonModule],
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  features: string[] = ['Fast exchange', 'Define own exchange ratio'];
  protected readonly router: Router = inject(Router);
  protected buildInfo: BuildInfo | undefined = undefined;
  private _storeUtil$: Store<UtilState> = inject(Store);

  ngOnInit() {
    this._storeUtil$
      .select(selectBuildInfo)
      .subscribe((data: BuildInfo | undefined) => {
        this.buildInfo = data;
      });
    this._storeUtil$.dispatch(loadBuildInfoAction());
  }

  navigateToLogin() {
    this.router.navigate(['dashboard']);
  }
}
