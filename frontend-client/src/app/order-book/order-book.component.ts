import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsType } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { CurrencyFormatter } from '../utils/currency-formatter';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderBookData } from '../utils/order-book-data';

echarts.use([
  BarChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
@Component({
  selector: 'app-order-book',
  imports: [NgxEchartsDirective, ReactiveFormsModule],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.css',
})
export class OrderBookComponent implements OnInit {
  private _chart$?: EChartsType;
  private readonly _formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this._formGroup = this.formBuilder.group({
      normalView: ['normal', [Validators.required]],
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  private seriesFormatter = function (value: CallbackDataParams) {
    if (typeof value.value == 'number') {
      return CurrencyFormatter.formatCurrency(value.value);
    }
    return '';
  };

  changeView(newViewFormat: string) {
    if (newViewFormat == 'normal') {
      this._formGroup.patchValue({ normalView: true });
    } else {
      this._formGroup.patchValue({ normalView: false });
    }
  }

  ngOnInit() {
    let ctx = document.getElementById('chart') || null;
    if (ctx) {
      this._chart$ = echarts.init(ctx);
      this._chart$.clear();
    }
    let orderBookData: OrderBookData = new OrderBookData(this.data);
    const chartOption: EChartsOption = {
      legend: {
        data: ['Ask', 'Bid'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          axisTick: {
            length: 6,
            lineStyle: {
              type: 'dashed',
              // ...
            },
          },
          axisLabel: {
            formatter: function (value) {
              return CurrencyFormatter.formatCurrency(value);
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: {
            show: false,
          },
          data: orderBookData.yAxisValues,
        },
      ],
      series: [
        {
          name: 'Ask',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'left',
            formatter: this.seriesFormatter,
          },
          emphasis: {
            focus: 'series',
          },
          data: orderBookData.normalAskData,
        },
        {
          name: 'Bid',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'right',
            formatter: this.seriesFormatter,
          },
          emphasis: {
            focus: 'series',
          },
          data: orderBookData.normalBidData,
        },
      ],
    };
    this._chart$?.setOption(chartOption);
  }

  data = {
    ask: [
      { rate: 4.2364, amount: 2000.0 },
      { rate: 4.2362, amount: 990.0 },
      { rate: 4.2361, amount: 3000.0 },
      { rate: 4.236, amount: 10000.0 },
      { rate: 4.2359, amount: 5000.0 },
      { rate: 4.2357, amount: 4130.77 },
      { rate: 4.2354, amount: 10363.84 },
      { rate: 4.2353, amount: 21167.43 },
      { rate: 4.2352, amount: 15067.43 },
      { rate: 4.235, amount: 4393.3 },
      { rate: 4.2346, amount: 500.0 },
      { rate: 4.2345, amount: 2500.0 },
      { rate: 4.2337, amount: 4758.07 },
      { rate: 4.2335, amount: 9453.81 },
      { rate: 4.23, amount: 2767.58 },
    ],
    bid: [
      { rate: 4.2251, amount: 4729.27 },
      { rate: 4.225, amount: 20641.61 },
      { rate: 4.2248, amount: 710.09 },
      { rate: 4.2246, amount: 11835.44 },
      { rate: 4.224, amount: 2367.42 },
      { rate: 4.2238, amount: 50.1 },
      { rate: 4.2237, amount: 1103.29 },
      { rate: 4.2236, amount: 1101.56 },
      { rate: 4.2235, amount: 35515.56 },
      { rate: 4.2232, amount: 11839.36 },
      { rate: 4.2231, amount: 360.72 },
      { rate: 4.223, amount: 301.05 },
      { rate: 4.222, amount: 1667.99 },
      { rate: 4.2216, amount: 501.0 },
      { rate: 4.2215, amount: 532.98 },
    ],
  };
}
