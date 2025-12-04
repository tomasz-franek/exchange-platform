import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportMenu} from '../report-menu/report-menu';
import {MenuComponent} from '../../menu/menu.component';
import {FinancialReportRequest} from '../../api';
import {Currency} from '../../api/model/currency';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {ReportStore} from '../reports.signal-store';
import {AccountsStore} from '../../accounts/accounts.signal-store';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe, ReportMenu, MenuComponent, Button, Select, DatePicker],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.scss'
})
export class FinancialReportComponent implements OnInit {
  protected formGroup: FormGroup;
  protected maxDate: Date = new Date();
  protected readonly store = inject(AccountsStore);
  protected readonly storeReport = inject(ReportStore);
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
    this.store.loadAccountBalanceList();
  }

  generateFinancialReport() {
    const currency = this.store.accountBalanceList().find((e) => e.userAccountId === this.formGroup.get('accountId')?.value)?.currency;
    if (currency) {
      const financialReportRequest: FinancialReportRequest = {
        month: this.formGroup.get('month')?.value,
        year: this.formGroup.get('year')?.value,
        userAccountId: this.formGroup.get('accountId')?.value,
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
