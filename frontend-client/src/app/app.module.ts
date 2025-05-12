import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { bootstrapApplication } from '@angular/platform-browser';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { NgxEchartsModule } from 'ngx-echarts';

echarts.use([BarChart]);
@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    AppComponent,
    StoreModule,
    NgxEchartsModule.forRoot({ echarts }),
  ],
})
export class AppModule {}

bootstrapApplication(AppComponent);
