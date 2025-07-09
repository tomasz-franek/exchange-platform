import { Component, inject, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsType } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent } from 'echarts/components';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderBookList } from '../../utils/order-book-list';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyFormatter } from '../../utils/formaters/currency-formatter';

echarts.use([BarChart, CanvasRenderer, LegendComponent, GridComponent]);

@Component({
  selector: 'app-order-book-chart',
  imports: [NgxEchartsDirective, ReactiveFormsModule, TranslatePipe],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './order-book-chart.component.html',
  styleUrl: './order-book-chart.component.css',
})
export class OrderBookChartComponent implements OnInit {
  private _chart$?: EChartsType;
  protected readonly formGroup: FormGroup;
  private orderBookData: OrderBookList;
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [Validators.required]),
    });
    this.orderBookData = new OrderBookList({
      b: [],
      s: [],
      f: true,
      p: undefined,
    });
  }

  private seriesFormatter = function (value: CallbackDataParams) {
    if (typeof value.value == 'number') {
      if (value.value > 0) {
        return CurrencyFormatter.formatCurrency(value.value);
      } else {
        return CurrencyFormatter.formatCurrencyNoSign(-value.value);
      }
    }
    return '';
  };

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this.formGroup.patchValue({ normalView });
    this.setChartData(normalView);
  }

  ngOnInit() {
    let ctx = document.getElementById('chart') || null;
    if (ctx) {
      this._chart$ = echarts.init(ctx);
    }
    this.initChartOption();

    this.setChartData(true);
  }

  private setChartData(normalData: boolean) {
    this._chart$?.setOption({
      yAxis: {
        data: this.orderBookData.yAxisValues,
      },
      series: [
        {
          name: 'Ask',
          data: normalData
            ? this.orderBookData.normalAsk
            : this.orderBookData.cumulativeAsk,
        },
        {
          name: 'Bid',
          data: normalData
            ? this.orderBookData.normalBid
            : this.orderBookData.cumulativeBid,
        },
      ],
    });
  }

  private initChartOption() {
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
            },
          },
          axisLabel: {
            formatter: function (value) {
              return CurrencyFormatter.formatCurrency(
                value < 0 ? -value : value,
              );
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
        },
      ],
      series: [
        {
          name: 'Ask',
          type: 'bar',
          stack: 'Total',
          color: 'rgba(50,205,50,0.7)',
          label: {
            show: true,
            position: 'left',
            formatter: this.seriesFormatter,
          },
          emphasis: {
            focus: 'series',
          },
          backgroundStyle: {},
        },
        {
          name: 'Bid',
          type: 'bar',
          stack: 'Total',
          color: 'rgba(232,0,13, 0.7)',
          label: {
            show: true,
            position: 'right',
            formatter: this.seriesFormatter,
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
    this._chart$?.setOption(chartOption);
  }

  public static readonly data = {
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
