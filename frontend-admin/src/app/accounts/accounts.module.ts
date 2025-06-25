import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';


@NgModule({
    imports: [
        CommonModule,
        AccountsRoutingModule,
        AccountsComponent
    ]
})
export class AccountsModule { }
