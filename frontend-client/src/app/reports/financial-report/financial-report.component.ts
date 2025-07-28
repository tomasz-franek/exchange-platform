import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ReportMenu } from '../report-menu/report-menu';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe, ReportMenu],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css',
})
export class FinancialReportComponent {
  protected formGroup: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({});
  }

  generateFinancialReport() {}
}
