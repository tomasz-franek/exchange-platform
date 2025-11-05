import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportMenu} from '../report-menu/report-menu';
import {MenuComponent} from '../../menu/menu.component';
import {BsDatepickerConfig, BsDatepickerDirective, BsDatepickerViewMode} from 'ngx-bootstrap/datepicker';
import {FinancialReportRequest} from '../../api';
import {Store} from '@ngrx/store';
import {ReportState} from '../state/report.selectors';
import {loadFinancialReportPdfDocumentAction} from '../state/report.actions';
import {AccountBalance} from '../../api/model/accountBalance';
import {AccountState, selectAccountBalanceList} from '../../accounts/state/account.selectors';
import {loadAccountBalanceListAction} from '../../accounts/state/account.actions';
import {Currency} from '../../api/model/currency';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe, ReportMenu, MenuComponent, BsDatepickerDirective, Button, Select],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css'
})
export class FinancialReportComponent implements OnInit {
  minMode: BsDatepickerViewMode = 'month';
  protected formGroup: FormGroup;
  protected maxDate: Date = new Date();
  protected bsConfig?: Partial<BsDatepickerConfig>;
  protected _account$: AccountBalance[] = [];
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _storeReports$: Store<ReportState> = inject(Store);
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
    const currency = this._account$.find((e) => e.userAccountId === this.formGroup.get('accountId')?.value)?.currency;
    if (currency) {
      const financialReportRequest: FinancialReportRequest = {
        month: this.formGroup.get('month')?.value,
        year: this.formGroup.get('year')?.value,
        userAccountID: this.formGroup.get('accountId')?.value,
        currency: currency as Currency
      };
      this._storeReports$.dispatch(loadFinancialReportPdfDocumentAction({financialReportRequest}));
    }
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
