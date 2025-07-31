import {Component, inject, OnInit} from '@angular/core';
import {BuildInfo} from '../../api/model/buildInfo';
import {TranslatePipe} from "@ngx-translate/core";
import {selectBuildInfo, UtilState} from '../state/util.selectors';
import {Store} from '@ngrx/store';
import {loadBuildInfoAction} from '../state/util.actions';

@Component({
  selector: 'app-utils-version',
  templateUrl: './version.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './version.component.css'
})
export class VersionComponent implements OnInit {
  buildInfo: BuildInfo | undefined = undefined;
  private _storeUtil$: Store<UtilState> = inject(Store);

  ngOnInit() {
    this._storeUtil$
    .select(selectBuildInfo)
    .subscribe((data: BuildInfo | undefined) => {
      this.buildInfo = data;
    });
    this._storeUtil$.dispatch(loadBuildInfoAction());
  }
}
