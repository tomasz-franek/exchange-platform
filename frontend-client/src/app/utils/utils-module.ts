import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderBookList } from './order-book-list';
import { PairUtils } from './pair-utils';
import { TranslateModule } from '@ngx-translate/core';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule.forRoot()],
  exports: [PairUtils, OrderBookList, LandingPageComponent],
})
export class UtilsModule {}
