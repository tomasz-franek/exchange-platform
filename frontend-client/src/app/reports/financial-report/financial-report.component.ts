import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ReportMenu } from '../report-menu/report-menu';
import { MenuComponent } from '../../menu/menu.component';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsDatepickerViewMode
} from 'ngx-bootstrap/datepicker';
import { FinancialReportRequest } from '../../api';
import { Store } from '@ngrx/store';
import { ReportState } from '../state/report.selectors';
import { loadFinancialReportPdfDocumentAction } from '../state/report.actions';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountState, selectAccountBalanceList } from '../../accounts/state/account.selectors';
import { loadAccountBalanceListAction } from '../../accounts/state/account.actions';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe, ReportMenu, MenuComponent, BsDatepickerDirective],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css'
})
export class FinancialReportComponent implements OnInit {
  protected formGroup: FormGroup;
  protected maxDate: Date = new Date();
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected bsConfig?: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode = 'month';
  private _storeReports$: Store<ReportState> = inject(Store);
  protected _account$: AccountBalance[] = [];
  private _storeAccount$: Store<AccountState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      month: [null, Validators.required],
      year: [null, Validators.required],
      yearAndMonth: [null],
      accountId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, {
      minMode: this.minMode,
      maxDate: new Date()
    });
    this._storeAccount$
    .select(selectAccountBalanceList)
    .subscribe((data: AccountBalance[]) => {
      this._account$ = data;
    });
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  generateFinancialReport() {
    const financialReportRequest: FinancialReportRequest = {
      month: this.formGroup.get('month')?.value,
      year: this.formGroup.get('year')?.value,
      userAccountIDs: [this.formGroup.get('accountId')?.value]
    };
    this._storeReports$.dispatch(loadFinancialReportPdfDocumentAction({ financialReportRequest }));
  }

  updateMonth(value: Date) {
    let dateString: string = value.toISOString();
    this.formGroup.patchValue({
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      yearAndMonth: value.getFullYear() + ' ' + (value.getMonth() + 1)
    });
  }
}
