import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportMenu} from '../report-menu/report-menu';
import {MenuComponent} from '../../menu/menu.component';
import {BsDatepickerConfig, BsDatepickerViewMode} from 'ngx-bootstrap/datepicker';
import {FinancialReportRequest} from '../../api';
import {Currency} from '../../api/model/currency';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {accountsStore} from '../../accounts/accounts.signal-store';
import {reportStore} from '../reports.signal-store';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe, ReportMenu, MenuComponent, Button, Select, DatePicker],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.scss'
})
export class FinancialReportComponent implements OnInit {
  minMode: BsDatepickerViewMode = 'month';
  protected formGroup: FormGroup;
  protected maxDate: Date = new Date();
  protected bsConfig?: Partial<BsDatepickerConfig>;
  protected readonly store = inject(accountsStore);
  protected readonly storeReport = inject(reportStore);
  private formBuilder: FormBuilder = inject(FormBuilder);

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
    this.store.loadAccountBalanceList();
  }

  generateFinancialReport() {
    const currency = this.store.accountBalanceList().find((e) => e.userAccountId === this.formGroup.get('accountId')?.value)?.currency;
    if (currency) {
      const financialReportRequest: FinancialReportRequest = {
        month: this.formGroup.get('month')?.value,
        year: this.formGroup.get('year')?.value,
        userAccountID: this.formGroup.get('accountId')?.value,
        currency: currency as Currency
      };
      this.storeReport.loadFinancialReportPdfDocument(financialReportRequest);
    }
  }

  dateSelect(eventYear: Date) {
    this.formGroup.patchValue({
      month: eventYear.getMonth() + 1,
      year: eventYear.getFullYear(),
    })
  }
}
