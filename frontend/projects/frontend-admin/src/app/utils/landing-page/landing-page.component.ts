import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {BuildInfo} from '../../api/model/buildInfo';
import {selectBuildInfo, UtilState} from '../state/util.selectors';
import {Store} from '@ngrx/store';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {loadBuildInfoAction} from '../state/util.actions';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [
    TranslatePipe,
    FooterComponent
  ],
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
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
