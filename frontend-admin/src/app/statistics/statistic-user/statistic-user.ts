import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectUsersStatisticResponse,
  StatisticState,
} from '../state/statistic.selectors';
import { loadUserStatisticAction } from '../state/statistic.actions';
import { UsersStatisticRequest } from '../../api/model/usersStatisticRequest';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { MenuComponent } from '../../menu/menu.component';
import { StatisticMenu } from '../statistic-menu/statistic-menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-statistic-user',
  templateUrl: './statistic-user.html',
  styleUrl: './statistic-user.css',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticUser implements OnInit {
  protected usersStatisticResponse: UsersStatisticResponse | null = null;
  private _storeProperty$: Store<StatisticState> = inject(Store);

  ngOnInit() {
    this._storeProperty$
      .select(selectUsersStatisticResponse)
      .subscribe((usersStatisticResponse) => {
        this.usersStatisticResponse = usersStatisticResponse;
      });
    const usersStatisticRequest: UsersStatisticRequest = {
      userId: '',
      currency: 'EUR',
    };
    this._storeProperty$.dispatch(
      loadUserStatisticAction({ usersStatisticRequest }),
    );
  }
}
