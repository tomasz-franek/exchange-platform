import { Component, effect, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { ReportMenu } from '../report-menu/report-menu';
import { Pair } from '../../api/model/pair';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Select } from 'primeng/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RatioRange } from 'shared-modules';
import { ReportPairRequest, ReportStore } from '../reports.signal-store';

@Component({
  selector: 'app-report-transactions',
  templateUrl: './report-pair.html',
  styleUrl: './report-pair.scss',
  imports: [
    MenuComponent,
    ReportMenu,
    FormsModule,
    ReactiveFormsModule,
    Select,
    TranslatePipe,
    RatioRange,
  ],
})
export class ReportPair implements OnInit {
  readonly formGroup: FormGroup;
  protected readonly translateService: TranslateService =
    inject(TranslateService);
  protected _pairs = Object.entries(Pair).map(([_, value]) => ({ value }));
  protected _periods: { value: number; label: string }[] = [];
  protected lowRatio: number = 0;
  protected highRatio: number = 0;
  protected currentRatio: number = 0;
  protected readonly store = inject(ReportStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      pair: new FormControl(undefined, [Validators.required]),
      period: new FormControl(12, [Validators.required]),
    });
    effect(() => {
      let response = this.store.pairPeriodResponse();
      if (response == null) {
        this.lowRatio = 0;
        this.highRatio = 0;
        this.currentRatio = 0;
      } else {

        this.lowRatio = response.minimumRatio || 0;
        this.highRatio = response.maximumRatio || 0;
        this.currentRatio = response.currentRatio || 0;
      }
    });
  }

  ngOnInit() {
    this._periods = [
      {
        value: 1,
        label: this.translateService.instant('PERIODS.M_1'),
      },
      {
        value: 3,
        label: this.translateService.instant('PERIODS.M_3'),
      },
      {
        value: 6,
        label: this.translateService.instant('PERIODS.M_6'),
      },
      {
        value: 12,
        label: this.translateService.instant('PERIODS.M_12'),
      },
      {
        value: 24,
        label: this.translateService.instant('PERIODS.M_24'),
      },
    ];
  }

  pairChange() {
    this.reloadData();
  }

  periodChange() {
    this.reloadData();
  }

  reloadData() {
    if (
      this.formGroup.get('pair') != null &&
      this.formGroup.get('period') != null
    ) {
      const pairRequests = {
        pair: this.formGroup.get('pair')?.value,
        period: this.formGroup.get('period')?.value,
      } as ReportPairRequest;
      this.store.loadPairPeriodReport(pairRequests);
    }
  }
}
