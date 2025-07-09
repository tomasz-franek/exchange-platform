import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderBookList } from './order-book-list';
import { PairUtils } from './pair-utils';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule.forRoot()],
  exports: [PairUtils, OrderBookList],
})
export class UtilsModule {}
