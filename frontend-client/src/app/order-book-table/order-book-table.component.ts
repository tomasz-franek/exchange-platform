import { Component, OnInit } from '@angular/core';
import { OrderBookData } from '../utils/order-book-data';
import { OrderBookChartComponent } from '../order-book-chart/order-book-chart.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-book-table',
  imports: [ReactiveFormsModule, NgForOf, NgIf, TranslatePipe],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css',
})
export class OrderBookTableComponent implements OnInit {
  private readonly _formGroup: FormGroup;
  protected orderBookData: OrderBookData;
  protected bidTableData: any[] = [];
  protected askTableData: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.orderBookData = new OrderBookData(OrderBookChartComponent.data);
    this._formGroup = this.formBuilder.group({
      normalView: ['normal', [Validators.required]],
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  ngOnInit() {
    this.setChartData(true);
  }

  private setChartData(normalData: boolean) {
    this.askTableData = normalData
      ? this.orderBookData.normalAskData
      : this.orderBookData.cumulativeAskData;
    this.bidTableData = normalData
      ? this.orderBookData.normalBidData
      : this.orderBookData.cumulativeBidData;
  }

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this._formGroup.patchValue({ normalView });
    this.setChartData(normalView);
  }

  protected readonly OrderBookData = OrderBookData;
}
