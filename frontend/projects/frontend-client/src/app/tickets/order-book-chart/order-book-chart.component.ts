import {
  Component,
  effect,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
} from '@angular/forms';
import { CurrencyFormatter } from '../../../formaters/currency-formatter';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SelectButton } from 'primeng/selectbutton';
import { OrderBookStore } from 'shared-modules';

echarts.use([BarChart, CanvasRenderer, LegendComponent, GridComponent]);

@Component({
  selector: 'app-order-book-chart',
  imports: [
    NgxEchartsDirective,
    ReactiveFormsModule,
    TranslatePipe,
    SelectButton,
  ],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './order-book-chart.component.html',
  styleUrl: './order-book-chart.component.scss',
})
export class OrderBookChartComponent implements OnInit, OnChanges {
  readonly formGroup: FormGroup;
  protected readonly orderBookStore = inject(OrderBookStore);
  protected translateService: TranslateService = inject(TranslateService);
  protected stateOptions: any[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private _chart$?: EChartsType;

  constructor() {
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', []),
    });
    effect(() => {
      let x = this.orderBookStore.normalBuyArray();
      if (x) {
        this.setChartData();
      }
    });
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.setChartData();
  }

  ngOnInit() {
    this.stateOptions = [
      {
        label: this.translateService.instant('NORMAL'),
        value: 'normal',
      },
      {
        label: this.translateService.instant('CUMULATIVE'),
        value: 'cumulative',
      },
    ];
    const ctx = document.getElementById('chart') || null;
    if (ctx) {
      this._chart$ = echarts.init(ctx);
    }
    this.initChartOption();
    this.setChartData();
  }
  changeChartView(event: any) {
    this.orderBookStore.updateCumulative(event.value == 'cumulative');
  }

  private readonly seriesFormatter = function (value: CallbackDataParams) {
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

  private setChartData() {
    this._chart$?.setOption({
      yAxis: {
        data: this.orderBookStore.yAxisValues(),
      },
      series: [
        {
          name: 'Sell',
          data: this.orderBookStore.sellArray().map((s) => {
            return s.a / 10000;
          }),
        },
        {
          name: 'Buy',
          data: this.orderBookStore.buyArray().map((s) => {
            return -s.a / 10000;
          }),
        },
      ],
    });
  }

  private initChartOption() {
    const chartOption: EChartsOption = {
      legend: {
        data: ['Sell', 'Buy'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        outerBounds: {
          left: 0,
          top: 0,
          width: 600,
          height: 400,
        },
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
        },
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
            formatter: this.seriesFormatter,
          },
          emphasis: {
            focus: 'series',
          },
          backgroundStyle: {},
        },
        {
          name: 'Buy',
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
}
