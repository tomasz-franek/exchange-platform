import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsType } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent } from 'echarts/components';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderBookList } from '../../utils/order-book-list';
import { CurrencyFormatter } from '../../../formaters/currency-formatter';
import { Pair } from '../../api/model/pair';
import { OrderBookData } from '../../api/model/orderBookData';
import { TranslatePipe } from '@ngx-translate/core';

echarts.use([BarChart, CanvasRenderer, LegendComponent, GridComponent]);

@Component({
  selector: 'app-order-book-chart',
  imports: [NgxEchartsDirective, ReactiveFormsModule, TranslatePipe],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './order-book-chart.component.html',
  styleUrl: './order-book-chart.component.css'
})
export class OrderBookChartComponent implements OnInit, OnChanges {
  @Input() pair: Pair | undefined;
  private _chart$?: EChartsType;
  @Input() orderBookData: OrderBookList;
  @Input() buyCurrency: string | undefined;
  @Input() viewMode: string | undefined;

  constructor() {
    this.orderBookData = new OrderBookList({} as OrderBookData);
  }

  ngOnChanges() {
    this.setChartData();
  }

  private seriesFormatter = function(value: CallbackDataParams) {
    if (typeof value.value == 'number') {
      if (value.value == 0) {
        return '';
      }
      if (value.value > 0) {
        return CurrencyFormatter.formatCurrency(value.value);
      } else {
        return CurrencyFormatter.formatCurrencyNoSign(-value.value);
      }
    }
    return '';
  };

  ngOnInit() {
    const ctx = document.getElementById('chart') || null;
    if (ctx) {
      this._chart$ = echarts.init(ctx);
    }
    this.initChartOption();
    this.setChartData();
  }

  private setChartData() {
    if (this.orderBookData == undefined) {
      return;
    }
    this._chart$?.setOption({
      yAxis: {
        data: this.orderBookData.yAxisValues
      },
      series: [
        {
          name: 'Sell',
          data: this.orderBookData.data.s.map((s) => {
            return s.a / 10000;
          })
        },
        {
          name: 'Buy',
          data: this.orderBookData.data.b.map((s) => {
            return -s.a / 10000;
          })
        }
      ]
    });
  }

  private initChartOption() {
    const chartOption: EChartsOption = {
      legend: {
        data: ['Sell', 'Buy']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisTick: {
            length: 6,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            formatter: function(value) {
              return CurrencyFormatter.formatCurrency(value);
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Sell',
          type: 'bar',
          stack: 'Total',
          color: 'rgba(50,205,50,0.7)',
          label: {
            show: true,
            position: 'left',
            formatter: this.seriesFormatter
          },
          emphasis: {
            focus: 'series'
          },
          backgroundStyle: {}
        },
        {
          name: 'Buy',
          type: 'bar',
          stack: 'Total',
          color: 'rgba(232,0,13, 0.7)',
          label: {
            show: true,
            position: 'right',
            formatter: this.seriesFormatter
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
    this._chart$?.setOption(chartOption);
  }
}
