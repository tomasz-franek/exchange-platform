import { Component, inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsType } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent } from 'echarts/components';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderBookList } from '../../utils/order-book-list';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyFormatter } from '../../../formaters/currency-formatter';
import { Pair } from '../../api/model/pair';
import { Subject, takeUntil } from 'rxjs';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { OrderBookData } from '../../api/model/orderBookData';

echarts.use([BarChart, CanvasRenderer, LegendComponent, GridComponent]);

@Component({
  selector: 'app-order-book-chart',
  imports: [NgxEchartsDirective, ReactiveFormsModule, TranslatePipe],
  providers: [provideEchartsCore({ echarts }), WebsocketService],
  templateUrl: './order-book-chart.component.html',
  styleUrl: './order-book-chart.component.css'
})
export class OrderBookChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pair: Pair | undefined;
  private _chart$?: EChartsType;
  protected readonly formGroup: FormGroup;
  private orderBookData: OrderBookList;
  private readonly _destroy$: Subject<void> = new Subject<void>();
  protected readonly websocketService: WebsocketService = inject(WebsocketService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly orderBookMap = new Map<Pair, OrderBookData>();
  @Input() buyCurrency: string | undefined;

  constructor() {
    this.orderBookData = new OrderBookList({} as OrderBookData);
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [])
    });
  }

  ngOnChanges() {
    if (this.pair == undefined) {
      this.orderBookData.updateData({
        p: this.pair,
        f: false,
        b: [],
        s: []
      });
    } else {
      this.orderBookData.updateData(
        this.orderBookMap.get(this.pair) || {
          p: this.pair,
          f: false,
          b: [],
          s: []
        }
      );
    }
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

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this.formGroup.patchValue({ normalView });
    this.orderBookData.cumulated = !normalView;
    this.setChartData();
  }

  ngOnInit() {
    const ctx = document.getElementById('chart') || null;
    if (ctx) {
      this._chart$ = echarts.init(ctx);
    }
    this.initChartOption();
    this.orderBookData.cumulated = false;
    this.setChartData();
    this.websocketService
    .getMessages()
    .pipe(takeUntil(this._destroy$))
    .subscribe((rows: OrderBookData[]) => {
      rows.forEach((row) => {
        if (row.p == this.pair) {
          this.orderBookData.updateData(row);
        }
        if (row.p != undefined) {
          this.orderBookMap.set(row.p, row);
        }
      });
    });
    this.changeView(this.formGroup.get('normalView')?.value);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setChartData() {
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
