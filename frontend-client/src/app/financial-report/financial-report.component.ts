import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-financial-report',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css',
})
export class FinancialReportComponent {
  protected formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  generateFinancialReport() {}
}
