import {Component, effect, inject} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {ReportMenu} from '../report-menu/report-menu';
import {Pair} from '../../api/model/pair';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Select} from 'primeng/select';
import {TranslatePipe} from '@ngx-translate/core';
import {RatioRange} from '../../../../../shared-modules/src/lib/ratio-range/ratio-range';
import {ReportPairRequest, ReportStore} from '../reports.signal-store';

@Component({
  selector: 'app-report-transactions',
  templateUrl: './report-pairs.html',
  styleUrl: './report-pairs.scss',
  imports: [MenuComponent, ReportMenu, FormsModule, ReactiveFormsModule, Select, TranslatePipe, RatioRange],
})
export class ReportPairs {
  readonly formGroup: FormGroup;
  protected _pairs = Object.entries(Pair).map(([_, value]) => ({value}));
  protected lowRatio: number = 0;
  protected highRatio: number = 0;
  protected currentRatio: number = 0;
  protected readonly store = inject(ReportStore);
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      pair: new FormControl(undefined, [Validators.required]),
    });
    effect(() => {
      let response = this.store.pairPeriodResponse();
      if (response != null) {
        this.lowRatio = response.minimumRatio || 0;
        this.highRatio = response.maximumRatio || 0;
        this.currentRatio = response.currentRatio || 0;
      } else {
        this.lowRatio = 0;
        this.highRatio = 0;
        this.currentRatio = 0;
      }
    });
  }

  //TODO: load report pairs
  pairChange() {
    if (this.formGroup.get('pair') == null) {
      const pairRequests = {
        pair: this.formGroup.get('pair')?.value,
        period: 12
      } as ReportPairRequest
      this.store.loadPairPeriodReport(pairRequests);
    }
  }
}
